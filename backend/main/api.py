from __future__ import annotations

from typing import Any, Dict, List

from django.http import Http404, JsonResponse
from django.views.decorators.http import require_GET

from .models import (
    Product,
    ProductImage,
    ProductFeature,
    ProductSubFeature,
    ProductTechnology,
    ProductFeatureBlock,
    ProductInfoBlock,
    ProductCTABlock
)

def _absolute_media_url(request, image_field) -> str | None:
    if not image_field:
        return None
    try:
        url = image_field.url
    except (ValueError, AttributeError):
        return None
    return request.build_absolute_uri(url)


def _serialize_product_base(product: Product) -> Dict[str, Any]:
    return {
        'id': product.id,
        'slug': product.slug,
        'name': product.name,
        'description': product.description,
        'category': product.category.slug if product.category else None,
        'available': product.available,
        'is_featured': product.is_featured,
    }

def _serialize_product_list(product: Product) -> Dict[str, Any]:
    data = _serialize_product_base(product)
    return data

def _serialize_product_detail(request, product: Product) -> Dict[str, Any]:
    data = _serialize_product_list(product)
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
            'alt': image.alt,
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


@require_GET
def item_list_api(request):
    products = (
        Product.objects.filter(available=True)
        .select_related('category')
        .prefetch_related('features', 'sub_features', 'images')
        .order_by('-is_featured', 'name')
    )

    payload = [_serialize_product_list(product) for product in products]
    return JsonResponse(payload, safe=False)


@require_GET
def item_detail_api(request, slug: str):
    try:
        product = (
            Product.objects
            .select_related('category')
            .prefetch_related(
                'features',
                'sub_features',
                'images',
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
