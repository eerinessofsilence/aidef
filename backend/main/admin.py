from django.contrib import admin
from .models import (
    Product, Category, ProductImage,
    FuelOption, MagazineOption,
    Accessory, ProductAccessory
)


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 3
    fields = ('image', 'alt', 'order')


class FuelOptionInline(admin.TabularInline):
    model = FuelOption
    extra = 1
    fields = ('name', 'capacity', 'extra_price', 'notes')


class MagazineOptionInline(admin.TabularInline):
    model = MagazineOption
    extra = 1
    fields = ('name', 'capacity', 'caliber', 'extra_price', 'notes')


class ProductAccessoryInline(admin.TabularInline):
    model = ProductAccessory
    extra = 1
    autocomplete_fields = ('accessory',)
    fields = ('accessory', 'quantity', 'extra_price')


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'product_type', 'category', 'available', 'price', 'discount', 'created_at')
    list_filter = ('product_type', 'available', 'category')
    search_fields = ('name', 'slug', 'sku')
    prepopulated_fields = {'slug': ('name',)}
    ordering = ('-created_at',)
    inlines = [ProductImageInline, ProductAccessoryInline]

    def get_inline_instances(self, request, obj=None):
        inlines = super().get_inline_instances(request, obj)
        if obj is None:
            return inlines
        custom = []
        custom.append(self.inline_instances_by_model(ProductImageInline, request, obj))
        custom.append(self.inline_instances_by_model(ProductAccessoryInline, request, obj))
        if obj.product_type == 'drone':
            custom.append(self.inline_instances_by_model(FuelOptionInline, request, obj))
        if obj.product_type == 'weapon':
            custom.append(self.inline_instances_by_model(MagazineOptionInline, request, obj))
        return [i for i in custom if i is not None]

    def inline_instances_by_model(self, inline_class, request, obj):
        try:
            inline = inline_class(self.model, self.admin_site)
            return inline
        except Exception:
            return None


@admin.register(Accessory)
class AccessoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'sku', 'price', 'created_at')
    search_fields = ('name', 'sku')


@admin.register(FuelOption)
class FuelOptionAdmin(admin.ModelAdmin):
    list_display = ('name', 'product', 'capacity', 'extra_price')
    search_fields = ('name', 'product__name')


@admin.register(MagazineOption)
class MagazineOptionAdmin(admin.ModelAdmin):
    list_display = ('name', 'product', 'capacity', 'caliber', 'extra_price')
    search_fields = ('name', 'product__name')
