from __future__ import annotations

from typing import Any, Dict, List

from django.http import Http404, JsonResponse
from django.views.decorators.http import require_GET

from .models import (
    Product,
    ProductImage
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

    return data


@require_GET
def item_list_api(request):
    products = (
        Product.objects.filter(available=True)
        .select_related('category')
        .prefetch_related('images')
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
                'images'
            )
            .get(slug=slug, available=True)
        )
    except Product.DoesNotExist as exc:
        raise Http404('Product not found') from exc

    payload = _serialize_product_detail(request, product)
    return JsonResponse(payload)
