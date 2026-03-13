from __future__ import annotations

from html import escape
import json
import logging
from typing import Any, Dict, List

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.mail import EmailMultiAlternatives
from django.core.validators import validate_email
from django.db import transaction
from django.http import Http404, JsonResponse
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

from .models import (
    BlogPost,
    BlogPostBlock,
    BlogPostHeroImage,
    BlogPostSection,
    CivilProduct,
    CivilProductCTABlock,
    CivilProductFeature,
    CivilProductFeatureBlock,
    CivilProductGallery,
    CivilProductImage,
    CivilProductInfoBlock,
    CivilProductSubFeature,
    CivilProductTechnology,
    ContactRequest,
    Product,
    ProductCTABlock,
    ProductDroneSliderMedia,
    ProductFinalCTABlock,
    ProductFeature,
    ProductFeatureBlock,
    ProductGallery,
    ProductImage,
    ProductInfoBlock,
    ProductSubFeature,
    ProductTechnology,
)

logger = logging.getLogger(__name__)


class ContactNotificationError(Exception):
    """Raised when the contact form email notification cannot be delivered."""


def _contact_notification_error_detail(exc: ContactNotificationError) -> str:
    detail = "Unable to send contact request email notification."
    if not settings.DEBUG:
        return detail

    cause = exc.__cause__
    if cause is None:
        return detail

    cause_message = str(cause).strip()
    if not cause_message:
        return detail
    return f"{detail} Email error: {cause_message}"


def _absolute_media_url(request, image_field) -> str | None:
    if not image_field:
        return None
    try:
        url = image_field.url
    except (ValueError, AttributeError):
        return None
    return request.build_absolute_uri(url)


SUPPORTED_LANGUAGES = {code.lower() for code, _ in settings.LANGUAGES}
DEFAULT_LANGUAGE = "en"


def _parse_accept_language(raw: str) -> List[str]:
    if not raw:
        return []
    choices: List[tuple[float, int, str]] = []
    for index, part in enumerate(raw.split(",")):
        chunk = part.strip()
        if not chunk:
            continue
        lang_range, *params = chunk.split(";")
        lang = lang_range.strip().lower()
        if not lang:
            continue
        base = lang.split("-")[0]
        q = 1.0
        for param in params:
            param = param.strip()
            if param.startswith("q="):
                try:
                    q = float(param[2:])
                except ValueError:
                    q = 0.0
        choices.append((q, index, base))
    choices.sort(key=lambda item: (-item[0], item[1]))
    return [lang for _, _, lang in choices]


def _get_request_language(request) -> str:
    header = request.headers.get("Accept-Language", "")
    for lang in _parse_accept_language(header):
        if lang in SUPPORTED_LANGUAGES:
            return lang
    fallback = getattr(request, "LANGUAGE_CODE", "")
    if fallback:
        base = fallback.split("-")[0].lower()
        if base in SUPPORTED_LANGUAGES:
            return base
    return DEFAULT_LANGUAGE


def _get_image_alt(image: ProductImage, lang: str) -> str:
    translations = list(image.translations.all())
    for translation in translations:
        if translation.lang == lang:
            return translation.alt
    if lang != DEFAULT_LANGUAGE:
        for translation in translations:
            if translation.lang == DEFAULT_LANGUAGE:
                return translation.alt
    if image.alt:
        return image.alt
    return ""


def _serialize_product_base(product: Product) -> Dict[str, Any]:
    return {
        'id': product.id,
        'slug': product.slug,
        'name': product.name,
        'description': product.description,
        'category': product.category.name if product.category else None,
        'available': product.available,
        'order': product.order,
    }

def _serialize_product_list(request, product: Product) -> Dict[str, Any]:
    data = _serialize_product_base(product)
    language = _get_request_language(request)
    first_image = next((image for image in product.images.all() if image.image), None)
    icon_url = _absolute_media_url(request, product.icon)
    dropdown_image_url = _absolute_media_url(request, product.dropdown_image)
    data["icon"] = (
        {
            "url": icon_url,
            "alt": (product.name or "").strip(),
        }
        if icon_url
        else None
    )
    data["dropdown_image"] = (
        {
            "url": dropdown_image_url,
            "alt": (product.name or "").strip(),
        }
        if dropdown_image_url
        else None
    )
    data["first_image"] = (
        {
            "id": first_image.id,
            "url": _absolute_media_url(request, first_image.image),
            "alt": _get_image_alt(first_image, language),
            "order": first_image.order,
        }
        if first_image
        else None
    )
    drone_slider_media: ProductDroneSliderMedia | None = getattr(
        product, "drone_slider_media", None
    )
    if drone_slider_media is not None:
        image_url = _absolute_media_url(request, drone_slider_media.image)
        video_url = _absolute_media_url(request, drone_slider_media.video)
        data["drone_slider"] = (
            {
                "image": image_url,
                "video": video_url,
            }
            if image_url or video_url
            else None
        )
    else:
        data["drone_slider"] = None
    return data

def _serialize_product_detail(request, product: Product) -> Dict[str, Any]:
    data = _serialize_product_list(request, product)
    language = _get_request_language(request)
    data.update(
        {
            'description': product.description,
            'created_at': product.created_at.isoformat(),
            'updated_at': product.updated_at.isoformat(),
        }
    )

    images: List[ProductImage] = list(product.images.all())
    data['images'] = [
        {
            'id': image.id,
            'url': _absolute_media_url(request, image.image),
            'alt': _get_image_alt(image, language),
            'order': image.order,
        }
        for image in images
        if image.image
    ]
    
    features: List[ProductFeature] = list(product.features.all())
    data['features'] = [
        {
            'id': feature.id,
            'name': feature.name,
            'value': feature.value,
            'description': feature.description,
            'order': feature.order,
        }
        for feature in features
    ]
    
    sub_features: List[ProductSubFeature] = list(product.sub_features.all())
    data['sub_features'] = [
        {
            'id': sub_feature.id,
            'name': sub_feature.name,
            'description': sub_feature.description,
            'order': sub_feature.order,
        }
        for sub_feature in sub_features
    ]
    
    gallery: List[ProductGallery] = list(product.gallery.all())
    data['gallery'] = [
        {
            'id': gallery_item.id,
            'url': _absolute_media_url(request, gallery_item.image),
            'alt': gallery_item.alt,
            'order': gallery_item.order,
        }
        for gallery_item in gallery
        if gallery_item.image
    ]

    technologies: List[ProductTechnology] = list(product.technologies.all())
    data['technologies'] = [
        {
            'id': technology.id,
            'name': technology.name,
            'description': technology.description,
            'tags': technology.tags or [],
            'order': technology.order,
        }
        for technology in technologies
    ]
    
    feature_blocks: List[ProductFeatureBlock] = list(product.feature_blocks.all())
    data['feature_blocks'] = [
        {
            'id': block.id,
            'name': block.name,
            'title': block.title,
            'description': block.description,
            'background_image': _absolute_media_url(request, block.background_image),
            'with_logo': block.with_logo,
            'order': block.order,
        }
        for block in feature_blocks
    ]
    
    info_blocks: List[ProductInfoBlock] = list(product.info_blocks.all())
    data['info_blocks'] = [
        {
            'id': block.id,
            'title_1': block.title_1,
            'description_1': block.description_1 or [],
            'image_1': _absolute_media_url(request, block.image_1),
            'title_2': block.title_2,
            'description_2': block.description_2 or [],
            'image_2': _absolute_media_url(request, block.image_2),
            'order': block.order,
        }
        for block in info_blocks
    ]
    
    cta_blocks: List[ProductCTABlock] = list(product.cta_blocks.all())
    data['cta_blocks'] = [
        {
            'id': block.id,
            'name': block.name,
            'title': block.title,
            'background_image': _absolute_media_url(request, block.background_image),
            'has_button': block.has_button,
            'order': block.order,
        }
        for block in cta_blocks
    ]

    try:
        final_cta_block: ProductFinalCTABlock | None = product.final_cta_block
    except ProductFinalCTABlock.DoesNotExist:
        final_cta_block = None

    data["final_cta_block"] = (
        {
            "id": final_cta_block.id,
            "title": final_cta_block.title,
            "paragraph": final_cta_block.paragraph,
            "has_button": final_cta_block.has_button,
        }
        if final_cta_block is not None
        else None
    )

    return data


def _get_civil_image_alt(image: CivilProductImage, lang: str) -> str:
    translations = list(image.translations.all())
    for translation in translations:
        if translation.lang == lang:
            return translation.alt
    if lang != DEFAULT_LANGUAGE:
        for translation in translations:
            if translation.lang == DEFAULT_LANGUAGE:
                return translation.alt
    if image.alt:
        return image.alt
    return ""


def _serialize_civil_product_base(product: CivilProduct) -> Dict[str, Any]:
    return {
        'id': product.id,
        'slug': product.slug,
        'name': product.name,
        'description': product.description,
        'category': product.category.name if product.category else None,
        'available': product.available,
        'order': product.order,
    }


def _serialize_civil_product_list(request, product: CivilProduct) -> Dict[str, Any]:
    data = _serialize_civil_product_base(product)
    language = _get_request_language(request)
    first_image = next((image for image in product.images.all() if image.image), None)
    icon_url = _absolute_media_url(request, product.icon)
    data["icon"] = (
        {
            "url": icon_url,
            "alt": (product.name or "").strip(),
        }
        if icon_url
        else None
    )
    data["first_image"] = (
        {
            "id": first_image.id,
            "url": _absolute_media_url(request, first_image.image),
            "alt": _get_civil_image_alt(first_image, language),
            "order": first_image.order,
        }
        if first_image
        else None
    )
    return data


def _serialize_civil_product_detail(request, product: CivilProduct) -> Dict[str, Any]:
    data = _serialize_civil_product_list(request, product)
    language = _get_request_language(request)
    data.update(
        {
            'description': product.description,
            'created_at': product.created_at.isoformat(),
            'updated_at': product.updated_at.isoformat(),
        }
    )

    images: List[CivilProductImage] = list(product.images.all())
    data['images'] = [
        {
            'id': image.id,
            'url': _absolute_media_url(request, image.image),
            'alt': _get_civil_image_alt(image, language),
            'order': image.order,
        }
        for image in images
        if image.image
    ]

    features: List[CivilProductFeature] = list(product.features.all())
    data['features'] = [
        {
            'id': feature.id,
            'name': feature.name,
            'value': feature.value,
            'description': feature.description,
            'order': feature.order,
        }
        for feature in features
    ]

    sub_features: List[CivilProductSubFeature] = list(product.sub_features.all())
    data['sub_features'] = [
        {
            'id': sub_feature.id,
            'name': sub_feature.name,
            'description': sub_feature.description,
            'order': sub_feature.order,
        }
        for sub_feature in sub_features
    ]

    gallery: List[CivilProductGallery] = list(product.gallery.all())
    data['gallery'] = [
        {
            'id': gallery_item.id,
            'url': _absolute_media_url(request, gallery_item.image),
            'alt': gallery_item.alt,
            'order': gallery_item.order,
        }
        for gallery_item in gallery
        if gallery_item.image
    ]

    technologies: List[CivilProductTechnology] = list(product.technologies.all())
    data['technologies'] = [
        {
            'id': technology.id,
            'name': technology.name,
            'description': technology.description,
            'tags': technology.tags or [],
            'order': technology.order,
        }
        for technology in technologies
    ]

    feature_blocks: List[CivilProductFeatureBlock] = list(product.feature_blocks.all())
    data['feature_blocks'] = [
        {
            'id': block.id,
            'name': block.name,
            'title': block.title,
            'description': block.description,
            'background_image': _absolute_media_url(request, block.background_image),
            'with_logo': block.with_logo,
            'order': block.order,
        }
        for block in feature_blocks
    ]

    info_blocks: List[CivilProductInfoBlock] = list(product.info_blocks.all())
    data['info_blocks'] = [
        {
            'id': block.id,
            'title_1': block.title_1,
            'description_1': block.description_1 or [],
            'image_1': _absolute_media_url(request, block.image_1),
            'title_2': block.title_2,
            'description_2': block.description_2 or [],
            'image_2': _absolute_media_url(request, block.image_2),
            'order': block.order,
        }
        for block in info_blocks
    ]

    cta_blocks: List[CivilProductCTABlock] = list(product.cta_blocks.all())
    data['cta_blocks'] = [
        {
            'id': block.id,
            'name': block.name,
            'title': block.title,
            'background_image': _absolute_media_url(request, block.background_image),
            'has_button': block.has_button,
            'order': block.order,
        }
        for block in cta_blocks
    ]

    return data


def _format_read_time_label(read_minutes: int | None) -> str:
    minutes = max(int(read_minutes or 0), 1)
    unit = "min" if minutes == 1 else "mins"
    return f"{minutes} {unit} read"


def _serialize_blog_post_list_item(request, post: BlogPost) -> Dict[str, Any]:
    return {
        "id": post.id,
        "slug": post.slug,
        "category": post.category.name if post.category else None,
        "category_slug": post.category.slug if post.category else None,
        "title": post.title,
        "hero_image": _absolute_media_url(request, post.hero_image),
        "subtitle": post.subtitle,
        "author": post.author.name if post.author else "",
        "author_role": post.author.role if post.author else "",
        "published_at": post.published_at.isoformat() if post.published_at else None,
        "read_minutes": post.read_minutes,
        "read_time": _format_read_time_label(post.read_minutes),
    }


def _serialize_blog_post_block(
    request,
    block: BlogPostBlock,
    *,
    fallback_id: str | None = None,
) -> Dict[str, Any]:
    image_url = _absolute_media_url(request, block.image)
    block_type = (
        BlogPostBlock.Kind.IMAGE
        if image_url
        else block.kind
        if block.kind in {
            BlogPostBlock.Kind.BULLETS,
            BlogPostBlock.Kind.QUOTE,
            BlogPostBlock.Kind.DIVIDER,
        }
        else BlogPostBlock.Kind.TEXT
    )
    return {
        "id": block.anchor_id or fallback_id or f"block-{block.pk}",
        "type": block_type,
        "title": block.title,
        "html": block.html,
        "paragraphs": block.paragraphs or [],
        "items": block.items or [],
        "image": image_url,
        "image_alt": block.image_alt,
        "order": block.order,
    }


def _serialize_blog_post_hero_image(
    request,
    hero_image: BlogPostHeroImage,
) -> Dict[str, Any]:
    return {
        "id": hero_image.id,
        "image": _absolute_media_url(request, hero_image.image),
        "alt": hero_image.alt,
        "order": hero_image.order,
    }


def _serialize_legacy_section(section: BlogPostSection) -> Dict[str, Any]:
    return {
        "id": section.anchor_id,
        "title": section.title,
        "paragraphs": section.paragraphs or [],
        "bullets": section.bullets or [],
        "order": section.order,
    }


def _serialize_legacy_section_from_block(
    block: Dict[str, Any],
) -> Dict[str, Any] | None:
    block_type = block.get("type")
    if block_type not in {
        BlogPostBlock.Kind.TEXT,
        BlogPostBlock.Kind.BULLETS,
        BlogPostBlock.Kind.QUOTE,
    }:
        return None

    return {
        "id": block["id"],
        "title": block.get("title", ""),
        "paragraphs": block.get("paragraphs", []),
        "bullets": block.get("items", []) if block_type == BlogPostBlock.Kind.BULLETS else [],
        "order": block.get("order", 0),
    }


def _serialize_blog_post_detail(request, post: BlogPost) -> Dict[str, Any]:
    blocks: List[BlogPostBlock] = list(post.blocks.all())
    hero_images: List[BlogPostHeroImage] = list(post.hero_images.all())
    sections: List[BlogPostSection] = list(post.sections.all())

    if blocks:
        serialized_blocks = [
            _serialize_blog_post_block(request, block) for block in blocks
        ]
    else:
        serialized_blocks = []
        for section in sections:
            block = BlogPostBlock(
                post=post,
                kind=(
                    BlogPostBlock.Kind.BULLETS
                    if section.bullets
                    else BlogPostBlock.Kind.TEXT
                ),
                title=section.title,
                anchor_id=section.anchor_id,
                html="",
                paragraphs=section.paragraphs,
                items=section.bullets,
                order=section.order,
            )
            serialized_blocks.append(
                _serialize_blog_post_block(
                    request,
                    block,
                    fallback_id=section.anchor_id or f"section-{section.pk}",
                )
            )

    serialized_sections = [_serialize_legacy_section(section) for section in sections]
    if not serialized_sections:
        serialized_sections = [
            serialized
            for block in serialized_blocks
            if (serialized := _serialize_legacy_section_from_block(block)) is not None
        ]

    return {
        "id": post.id,
        "slug": post.slug,
        "category": post.category.name if post.category else None,
        "category_slug": post.category.slug if post.category else None,
        "title": post.title,
        "hero_image": _absolute_media_url(request, post.hero_image),
        "hero_images": [
            _serialize_blog_post_hero_image(request, hero_image)
            for hero_image in hero_images
            if hero_image.image
        ],
        "subtitle": post.subtitle,
        "author": post.author.name if post.author else "",
        "author_role": post.author.role if post.author else "",
        "published_at": post.published_at.isoformat() if post.published_at else None,
        "read_minutes": post.read_minutes,
        "read_time": _format_read_time_label(post.read_minutes),
        "blocks": serialized_blocks,
        "sections": serialized_sections,
    }


@require_GET
def blog_post_list_api(request):
    posts = (
        BlogPost.objects
        .filter(is_published=True)
        .select_related("category", "author")
        .order_by("order", "-published_at", "-created_at", "pk")
    )
    payload = [_serialize_blog_post_list_item(request, post) for post in posts]
    return JsonResponse(payload, safe=False)


@require_GET
def blog_post_detail_api(request, slug: str):
    try:
        post = (
            BlogPost.objects
            .select_related("category", "author")
            .prefetch_related("blocks", "hero_images", "sections")
            .get(slug=slug, is_published=True)
        )
    except BlogPost.DoesNotExist as exc:
        raise Http404("Blog post not found") from exc

    payload = _serialize_blog_post_detail(request, post)
    return JsonResponse(payload)


@require_GET
def item_list_api(request):
    products = (
        Product.objects.filter(available=True)
        .select_related('category', 'drone_slider_media')
        .prefetch_related('features', 'sub_features', 'images__translations')
        .order_by('order', 'name')
    )

    payload = [_serialize_product_list(request, product) for product in products]
    return JsonResponse(payload, safe=False)


@require_GET
def item_detail_api(request, slug: str):
    try:
        product = (
            Product.objects
            .select_related('category', 'drone_slider_media', 'final_cta_block')
            .prefetch_related(
                'features',
                'sub_features',
                'images__translations',
                'gallery',
                'technologies',
                'feature_blocks',
                'info_blocks',
                'cta_blocks',
            )
            .get(slug=slug, available=True)
        )
    except Product.DoesNotExist as exc:
        raise Http404('Product not found') from exc

    payload = _serialize_product_detail(request, product)
    return JsonResponse(payload)


@require_GET
def civil_item_list_api(request):
    products = (
        CivilProduct.objects.filter(available=True)
        .select_related('category')
        .prefetch_related('features', 'sub_features', 'images__translations')
        .order_by('order', 'name')
    )

    payload = [_serialize_civil_product_list(request, product) for product in products]
    return JsonResponse(payload, safe=False)


@require_GET
def civil_item_detail_api(request, slug: str):
    try:
        product = (
            CivilProduct.objects
            .select_related('category')
            .prefetch_related(
                'features',
                'sub_features',
                'images__translations',
                'gallery',
                'technologies',
                'feature_blocks',
                'info_blocks',
                'cta_blocks',
            )
            .get(slug=slug, available=True)
        )
    except CivilProduct.DoesNotExist as exc:
        raise Http404('Civil product not found') from exc

    payload = _serialize_civil_product_detail(request, product)
    return JsonResponse(payload)


def _clean_payload_value(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, str):
        return value.strip()
    return str(value).strip()


def _get_request_payload(request) -> Dict[str, Any] | None:
    content_type = request.content_type or ""
    if "application/json" in content_type:
        try:
            raw_body = request.body.decode("utf-8") if request.body else ""
            payload = json.loads(raw_body) if raw_body else {}
        except json.JSONDecodeError:
            return None
        return payload if isinstance(payload, dict) else None
    if request.POST:
        return request.POST.dict()
    return {}


def _get_client_ip(request) -> str | None:
    forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR", "")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR")


def _contact_notification_recipients() -> List[str]:
    raw_recipients = getattr(settings, "CONTACT_REQUEST_NOTIFICATION_EMAILS", [])
    if isinstance(raw_recipients, str):
        candidates = raw_recipients.split(",")
    elif isinstance(raw_recipients, (list, tuple, set)):
        candidates = list(raw_recipients)
    else:
        candidates = []

    recipients: List[str] = []
    for candidate in candidates:
        email = str(candidate).strip()
        if not email:
            continue
        try:
            validate_email(email)
        except ValidationError:
            logger.warning("Skipping invalid contact notification email: %s", email)
            continue
        recipients.append(email)
    return recipients


def _contact_display_name(contact_request: ContactRequest) -> str:
    full_name = (
        f"{contact_request.first_name} {contact_request.last_name}".strip()
    )
    return full_name or contact_request.email or f"Contact #{contact_request.id}"


def _contact_display_country(contact_request: ContactRequest) -> str:
    if contact_request.country_name and contact_request.country_code:
        return (
            f"{contact_request.country_name} "
            f"({contact_request.country_code})"
        )
    return (
        contact_request.country_name
        or contact_request.country_code
        or "-"
    )


def _contact_admin_url(
    contact_request: ContactRequest, request=None
) -> str:
    admin_path = reverse(
        "admin:main_contactrequest_change",
        args=[contact_request.id],
    )
    if request is None:
        return admin_path
    return request.build_absolute_uri(admin_path)


def _build_contact_notification_subject(
    contact_request: ContactRequest,
) -> str:
    display_name = _contact_display_name(contact_request)
    product = (contact_request.product or "").strip()
    if product:
        return f"New contact — {display_name} ({product})"
    return f"New contact — {display_name}"


def _build_contact_notification_message(
    contact_request: ContactRequest, request=None
) -> str:
    display_name = _contact_display_name(contact_request)
    country = _contact_display_country(contact_request)
    admin_url = _contact_admin_url(contact_request, request)
    lines = [
        "New contact form submission",
        "",
        "-----",
        "Main contact information",
        f"Name: {display_name}",
        f"Email: {contact_request.email}",
        f"Phone: {contact_request.phone or '-'}",
        "",
        "-----",
        "Request details",
        f"Product: {contact_request.product or '-'}",
        f"Country: {country}",
        f"Language: {contact_request.language or '-'}",
        f"Variant: {contact_request.variant}",
        "",
        "-----",
        "Message",
        contact_request.message or "-",
        "",
        "-----",
        "Additional information",
        f"Website: {contact_request.website or '-'}",
        f"Address line 1: {contact_request.address_line1 or '-'}",
        f"Address line 2: {contact_request.address_line2 or '-'}",
        "",
        "-----",
        "Technical information",
        f"ID: {contact_request.id}",
        f"Created timestamp: {contact_request.created_at.isoformat()}",
        f"Source page: {contact_request.source or '-'}",
        f"IP address: {contact_request.ip_address or '-'}",
        f"User agent: {contact_request.user_agent or '-'}",
        f"View in admin: {admin_url}",
    ]
    return "\n".join(lines)


def _build_contact_notification_html(
    contact_request: ContactRequest, request=None
) -> str:
    display_name = escape(_contact_display_name(contact_request))
    email_address = escape(contact_request.email or "-")
    phone = escape(contact_request.phone or "-")
    product = escape(contact_request.product or "-")
    country = escape(_contact_display_country(contact_request))
    language = escape(contact_request.language or "-")
    variant = escape(contact_request.variant or "-")
    website = escape(contact_request.website or "-")
    address_line1 = escape(contact_request.address_line1 or "-")
    address_line2 = escape(contact_request.address_line2 or "-")
    created_timestamp = escape(contact_request.created_at.isoformat())
    source_page = escape(contact_request.source or "-")
    ip_address = escape(contact_request.ip_address or "-")
    user_agent = escape(contact_request.user_agent or "-")
    admin_url = escape(_contact_admin_url(contact_request, request))
    message = escape(contact_request.message or "-").replace("\n", "<br>")

    return f"""
<html>
  <body style="margin:0;padding:24px;background:#f5f5f5;font-family:Arial,sans-serif;color:#111827;">
    <div style="max-width:720px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;padding:32px;">
      <h1 style="margin:0 0 8px;font-size:24px;line-height:1.2;">New contact form submission</h1>
      <p style="margin:0 0 24px;color:#6b7280;">Reference ID: {contact_request.id}</p>

      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
      <h2 style="margin:0 0 16px;font-size:18px;">Main contact information</h2>
      <p style="margin:0 0 8px;"><strong>Name:</strong> {display_name}</p>
      <p style="margin:0 0 8px;"><strong>Email:</strong> <a href="mailto:{email_address}">{email_address}</a></p>
      <p style="margin:0;"><strong>Phone:</strong> {phone}</p>

      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
      <h2 style="margin:0 0 16px;font-size:18px;">Request details</h2>
      <p style="margin:0 0 8px;"><strong>Product:</strong> {product}</p>
      <p style="margin:0 0 8px;"><strong>Country:</strong> {country}</p>
      <p style="margin:0 0 8px;"><strong>Language:</strong> {language}</p>
      <p style="margin:0;"><strong>Variant:</strong> {variant}</p>

      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
      <h2 style="margin:0 0 16px;font-size:18px;">Message</h2>
      <div style="padding:16px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;line-height:1.6;">{message}</div>

      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
      <h2 style="margin:0 0 16px;font-size:18px;">Additional information</h2>
      <p style="margin:0 0 8px;"><strong>Website:</strong> {website}</p>
      <p style="margin:0 0 8px;"><strong>Address line 1:</strong> {address_line1}</p>
      <p style="margin:0;"><strong>Address line 2:</strong> {address_line2}</p>

      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
      <h2 style="margin:0 0 16px;font-size:18px;">Technical information</h2>
      <p style="margin:0 0 8px;"><strong>Created timestamp:</strong> {created_timestamp}</p>
      <p style="margin:0 0 8px;"><strong>Source page:</strong> {source_page}</p>
      <p style="margin:0 0 8px;"><strong>IP address:</strong> {ip_address}</p>
      <p style="margin:0 0 8px;"><strong>User agent:</strong> {user_agent}</p>
      <p style="margin:0;"><strong>View in admin:</strong> <a href="{admin_url}">{admin_url}</a></p>
    </div>
  </body>
</html>
""".strip()


@csrf_exempt
@require_POST
def contact_request_api(request):
    payload = _get_request_payload(request)
    if payload is None:
        return JsonResponse(
            {"detail": "Invalid request payload."}, status=400
        )

    variant = _clean_payload_value(payload.get("variant")).lower()
    if not variant:
        variant = ContactRequest.Variant.DEFAULT
    if variant not in (
        ContactRequest.Variant.DEFAULT,
        ContactRequest.Variant.SUPPORT,
    ):
        return JsonResponse({"detail": "Invalid form variant."}, status=400)

    first_name = _clean_payload_value(payload.get("firstName"))
    last_name = _clean_payload_value(payload.get("lastName"))
    email = _clean_payload_value(payload.get("email"))
    phone = _clean_payload_value(payload.get("phone"))
    product = _clean_payload_value(payload.get("product"))
    country_code = _clean_payload_value(payload.get("country"))
    country_name = _clean_payload_value(
        payload.get("countryName") or payload.get("country_name")
    )
    address_line1 = _clean_payload_value(
        payload.get("city") or payload.get("addressLine1")
    )
    address_line2 = _clean_payload_value(
        payload.get("addressLine1") or payload.get("addressLine2")
    )
    website = _clean_payload_value(payload.get("website"))
    message = _clean_payload_value(payload.get("message"))
    source = _clean_payload_value(payload.get("source"))
    language = _clean_payload_value(payload.get("language"))

    required_fields = {
        "firstName": first_name,
        "lastName": last_name,
        "email": email,
        "message": message,
    }
    if variant != ContactRequest.Variant.SUPPORT:
        required_fields.update(
            {
                "phone": phone,
                "product": product,
                "country": country_code,
            }
        )

    errors: Dict[str, str] = {}
    for key, value in required_fields.items():
        if not value:
            errors[key] = "This field is required."

    if email:
        try:
            validate_email(email)
        except ValidationError:
            errors["email"] = "Enter a valid email address."

    if errors:
        return JsonResponse(
            {"detail": "Validation failed.", "errors": errors}, status=400
        )

    try:
        with transaction.atomic():
            contact_request = ContactRequest.objects.create(
                variant=variant,
                first_name=first_name,
                last_name=last_name,
                email=email,
                phone=phone,
                product=product,
                country_code=country_code,
                country_name=country_name,
                address_line1=address_line1,
                address_line2=address_line2,
                website=website,
                message=message,
                source=source,
                language=language or _get_request_language(request),
                ip_address=_get_client_ip(request),
                user_agent=_clean_payload_value(
                    request.META.get("HTTP_USER_AGENT")
                ),
            )

            recipients = _contact_notification_recipients()
            if recipients:
                subject = _build_contact_notification_subject(contact_request)
                notification_message = _build_contact_notification_message(
                    contact_request, request=request
                )
                notification_html = _build_contact_notification_html(
                    contact_request, request=request
                )
                try:
                    email_message = EmailMultiAlternatives(
                        subject=subject,
                        body=notification_message,
                        from_email=getattr(settings, "DEFAULT_FROM_EMAIL", ""),
                        to=recipients,
                        reply_to=[contact_request.email] if contact_request.email else None,
                    )
                    email_message.attach_alternative(
                        notification_html,
                        "text/html",
                    )
                    email_message.send(fail_silently=False)
                except Exception as exc:
                    logger.exception(
                        "Failed to send contact request email notification for request %s",
                        contact_request.id,
                    )
                    raise ContactNotificationError from exc
    except ContactNotificationError as exc:
        return JsonResponse(
            {"detail": _contact_notification_error_detail(exc)},
            status=502,
        )

    return JsonResponse(
        {"status": "ok", "id": contact_request.id}, status=201
    )
