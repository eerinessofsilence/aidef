from __future__ import annotations

from typing import Any, Dict, List

from django.http import Http404, JsonResponse
from django.views.decorators.http import require_GET

from .models import (
    Accessory,
    FuelOption,
    MagazineOption,
    Product,
    ProductAccessory,
    ProductImage,
)


def _to_float(value) -> float | None:
    if value is None:
        return None
    return float(value)


def _absolute_media_url(request, image_field) -> str | None:
    if not image_field:
        return None
    # build_absolute_uri can raise for unsaved files; swallow those gracefully
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
        'price': _to_float(product.price),
        'discount': _to_float(product.discount),
        'price_after_discount': product.price_after_discount(),
        'product_type': product.product_type,
        'available': product.available,
    }


def _serialize_product_list(product: Product) -> Dict[str, Any]:
    data = _serialize_product_base(product)
    if product.category:
        data['category'] = {
            'id': product.category_id,
            'name': product.category.name,
            'slug': product.category.slug,
        }
    else:
        data['category'] = None
    return data


def _serialize_fuel_option(option: FuelOption) -> Dict[str, Any]:
    return {
        'id': option.id,
        'name': option.name,
        'extra_price': _to_float(option.extra_price),
        'capacity': option.capacity,
        'notes': option.notes,
    }


def _serialize_magazine_option(option: MagazineOption) -> Dict[str, Any]:
    return {
        'id': option.id,
        'name': option.name,
        'capacity': option.capacity,
        'caliber': option.caliber,
        'extra_price': _to_float(option.extra_price),
        'notes': option.notes,
    }


def _serialize_accessory(accessory: Accessory, relation: ProductAccessory) -> Dict[str, Any]:
    return {
        'id': accessory.id,
        'name': accessory.name,
        'sku': accessory.sku,
        'price': _to_float(accessory.price),
        'quantity': relation.quantity,
        'extra_price': _to_float(relation.extra_price),
    }


def _serialize_product_detail(request, product: Product) -> Dict[str, Any]:
    data = _serialize_product_list(product)
    data.update(
        {
            'description': product.description,
            'sku': product.sku,
            'specs': product.specs,
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

    if product.product_type == 'drone':
        data['fuel_options'] = [_serialize_fuel_option(option) for option in product.fuel_options.all()]
    else:
        data['fuel_options'] = []

    if product.product_type == 'weapon':
        data['magazine_options'] = [
            _serialize_magazine_option(option) for option in product.magazine_options.all()
        ]
    else:
        data['magazine_options'] = []

    data['accessories'] = [
        _serialize_accessory(pa.accessory, pa) for pa in product.product_accessories.all()
    ]

    return data


@require_GET
def item_list_api(request):
    products = (
        Product.objects.filter(available=True)
        .select_related('category')
        .prefetch_related('images')
        .order_by('name')
    )

    payload = [_serialize_product_list(product) for product in products]
    return JsonResponse(payload, safe=False)


@require_GET
def item_detail_api(request, pk: int):
    try:
        product = (
            Product.objects.select_related('category')
            .prefetch_related(
                'images',
                'fuel_options',
                'magazine_options',
                'product_accessories__accessory',
            )
            .get(pk=pk, available=True)
        )
    except Product.DoesNotExist as exc:
        raise Http404('Product not found') from exc

    payload = _serialize_product_detail(request, product)
    return JsonResponse(payload)
