from __future__ import annotations

import json
from typing import Any, Dict, List

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.http import Http404, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

from .models import (
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
    LinkedInPost,
    Product,
    ProductCTABlock,
    ProductDroneSliderMedia,
    ProductFeature,
    ProductFeatureBlock,
    ProductGallery,
    ProductImage,
    ProductInfoBlock,
    ProductSubFeature,
    ProductTechnology,
)

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


def _serialize_linkedin_post(post: LinkedInPost) -> Dict[str, Any]:
    return {
        "id": post.id,
        "embed_url": post.embed_url,
        "order": post.order,
    }


@require_GET
def linkedin_post_list_api(request):
    posts = (
        LinkedInPost.objects.filter(is_active=True)
        .order_by("order", "-created_at", "pk")
    )
    payload = [_serialize_linkedin_post(post) for post in posts]
    return JsonResponse(payload, safe=False)


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
            .select_related('category', 'drone_slider_media')
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
    address_line3 = _clean_payload_value(
        payload.get("addressLine2") or payload.get("addressLine3")
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
        address_line3=address_line3,
        website=website,
        message=message,
        source=source,
        language=language or _get_request_language(request),
        ip_address=_get_client_ip(request),
        user_agent=_clean_payload_value(
            request.META.get("HTTP_USER_AGENT")
        ),
    )

    return JsonResponse(
        {"status": "ok", "id": contact_request.id}, status=201
    )
