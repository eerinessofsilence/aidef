from django.shortcuts import render, get_object_or_404
from django.db.models import Q, Prefetch
from .models import Product, Category, Accessory, FuelOption, MagazineOption, ProductAccessory


def catalog(request):
    query = request.GET.get("q")
    category_slug = request.GET.get("category")

    products = Product.objects.filter(available=True).prefetch_related("images", "category")

    if category_slug:
        products = products.filter(category__slug=category_slug)
    if query:
        products = products.filter(
            Q(name__icontains=query) | Q(description__icontains=query)
        )

    categories = Category.objects.all().order_by("name")

    context = {
        "products": products,
        "categories": categories,
        "selected_category": category_slug,
        "query": query,
    }
    return render(request, "shop/catalog.html", context)


def product_detail(request, slug):
    product = get_object_or_404(
        Product.objects.prefetch_related(
            "images",
            "product_accessories__accessory",
            "fuel_options",
            "magazine_options",
        ),
        slug=slug,
        available=True,
    )

    fuel_options = product.fuel_options.all() if product.product_type == "drone" else []
    magazine_options = product.magazine_options.all() if product.product_type == "weapon" else []
    accessories = [pa.accessory for pa in product.product_accessories.all()]

    context = {
        "product": product,
        "fuel_options": fuel_options,
        "magazine_options": magazine_options,
        "accessories": accessories,
    }
    return render(request, "shop/product_detail.html", context)


def accessories_list(request):
    accessories = Accessory.objects.all().order_by("name")
    return render(request, "shop/accessories.html", {"accessories": accessories})
