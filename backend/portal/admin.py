from django.contrib import admin

from .models import (
    PortalProduct,
    ProductImage,
    ProductCharacteristic,
    ProductCharacteristicsBlock,
    ProductModule,
    ProductModuleImage,
    ProductModulesBlock,
    IconType
)


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 0
    fields = ("image", "alt", "is_preview", "order")
    ordering = ("order",)


class ProductCharacteristicInline(admin.TabularInline):
    model = ProductCharacteristic
    extra = 0
    fields = ("name", "description", "block", "order")
    ordering = ("order",)


class ProductCharacteristicsBlockInline(admin.StackedInline):
    model = ProductCharacteristicsBlock
    extra = 0
    fields = ("title", "icon_type", "icon_lucide", "icon_file")


class ProductModuleInline(admin.TabularInline):
    model = ProductModule
    extra = 0
    fields = ("name", "tag", "description", "button_text", "block", "order")
    ordering = ("order",)


class ProductModulesBlockInline(admin.StackedInline):
    model = ProductModulesBlock
    extra = 0
    fields = ("subtitle", "title")


@admin.register(PortalProduct)
class PortalProductAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "status", "serial_number", "order", "created_at")
    list_filter = ("order", "status", "category")
    search_fields = ("name", "slug", "serial_number", "category__name")
    prepopulated_fields = {"slug": ("name",)}
    list_select_related = ("category",)
    ordering = ("order", "-created_at")
    inlines = [
        ProductImageInline,
        ProductCharacteristicsBlockInline,
        ProductCharacteristicInline,
        ProductModulesBlockInline,
        ProductModuleInline,
    ]


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ("product", "alt", "is_preview", "order")
    list_filter = ("is_preview",)
    search_fields = ("product__name", "alt")
    ordering = ("product", "order")


@admin.register(ProductCharacteristicsBlock)
class ProductCharacteristicsBlockAdmin(admin.ModelAdmin):
    list_display = ("product", "title", "icon_type", "icon_preview")
    search_fields = ("product__name", "title", "icon_lucide")
    list_filter = ("icon_type",)

    @admin.display(description="Icon")
    def icon_preview(self, obj):
        if obj.icon_type == IconType.LUCIDE:
            return f"lucide:{obj.icon_lucide or '-'}"
        if obj.icon_file:
            return obj.icon_file.name
        return "-"

@admin.register(ProductCharacteristic)
class ProductCharacteristicAdmin(admin.ModelAdmin):
    list_display = ("product", "name", "block", "order")
    list_filter = ("block",)
    search_fields = ("product__name", "name", "description")
    ordering = ("product", "order")


class ProductModuleImageInline(admin.TabularInline):
    model = ProductModuleImage
    extra = 0
    fields = ("image", "alt")


@admin.register(ProductModule)
class ProductModuleAdmin(admin.ModelAdmin):
    list_display = ("product", "name", "tag", "block", "order")
    list_filter = ("block",)
    search_fields = ("product__name", "name", "tag", "description")
    ordering = ("product", "order")
    inlines = [ProductModuleImageInline]


@admin.register(ProductModuleImage)
class ProductModuleImageAdmin(admin.ModelAdmin):
    list_display = ("module", "alt")
    search_fields = ("module__name", "alt")


@admin.register(ProductModulesBlock)
class ProductModulesBlockAdmin(admin.ModelAdmin):
    list_display = ("product", "subtitle", "title")
    search_fields = ("product__name", "subtitle", "title")
