from django.contrib import admin

from .models import (
    PortalProduct,
    ProductImage,
    ProductGallery,
    ProductPresentationInfo,
    ProductCharacteristic,
    ProductCharacteristicsBlock,
    ProductModule,
    ProductModuleCharacteristic,
    ProductModuleImage,
    ProductModulePlacement,
    ProductModulesBlock,
    ProductTextBlock,
    IconType
)


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 0
    fields = ("image", "alt", "is_preview", "order")
    ordering = ("order",)


class ProductGalleryInline(admin.TabularInline):
    model = ProductGallery
    extra = 0
    fields = ("image", "alt", "order")
    ordering = ("order",)


class ProductPresentationInfoInline(admin.TabularInline):
    model = ProductPresentationInfo
    extra = 0
    fields = ("title", "description", "order")
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


class ProductModulePlacementInline(admin.TabularInline):
    model = ProductModulePlacement
    extra = 0
    fields = ("module", "block", "order")
    ordering = ("order",)

    def get_formset(self, request, obj=None, **kwargs):
        self._parent_product = obj
        return super().get_formset(request, obj, **kwargs)

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "block":
            parent = getattr(self, "_parent_product", None)
            if parent is not None:
                kwargs["queryset"] = ProductModulesBlock.objects.filter(
                    product=parent
                )
            else:
                kwargs["queryset"] = ProductModulesBlock.objects.none()
        return super().formfield_for_foreignkey(
            db_field, request, **kwargs
        )


class ProductModulePlacementForModuleInline(admin.TabularInline):
    model = ProductModulePlacement
    extra = 0
    fields = ("product", "block", "order")
    ordering = ("order",)


class ProductModuleCharacteristicInline(admin.TabularInline):
    model = ProductModuleCharacteristic
    extra = 0
    fields = ("name", "description", "order")
    ordering = ("order",)


class ProductModulesBlockInline(admin.StackedInline):
    model = ProductModulesBlock
    extra = 0
    fields = ("subtitle", "title")

class ProductTextBlockInline(admin.TabularInline):
    model = ProductTextBlock
    extra = 0
    fields = ("title", "text", "order")
    ordering = ("order",)


@admin.register(PortalProduct)
class PortalProductAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "serial_number", "order", "created_at")
    list_filter = ("order", "category")
    search_fields = ("name", "slug", "serial_number", "category__name")
    prepopulated_fields = {"slug": ("name",)}
    list_select_related = ("category",)
    ordering = ("order", "-created_at")
    inlines = [
        ProductImageInline,
        ProductGalleryInline,
        ProductPresentationInfoInline,
        ProductCharacteristicsBlockInline,
        ProductCharacteristicInline,
        ProductModulesBlockInline,
        ProductModulePlacementInline,
        ProductTextBlockInline,
    ]


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ("product", "alt", "is_preview", "order")
    list_filter = ("is_preview",)
    search_fields = ("product__name", "alt")
    ordering = ("product", "order")


@admin.register(ProductGallery)
class ProductGalleryAdmin(admin.ModelAdmin):
    list_display = ("product", "alt", "order")
    search_fields = ("product__name", "alt")
    ordering = ("product", "order")


@admin.register(ProductPresentationInfo)
class ProductPresentationInfoAdmin(admin.ModelAdmin):
    list_display = ("product", "title", "order")
    search_fields = ("product__name", "title", "description")
    ordering = ("product", "order", "id")


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
    list_display = ("name", "tag", "button_text")
    search_fields = ("name", "tag", "description")
    ordering = ("name", "id")
    inlines = [
        ProductModuleImageInline,
        ProductModuleCharacteristicInline,
        ProductModulePlacementForModuleInline,
    ]


@admin.register(ProductModuleImage)
class ProductModuleImageAdmin(admin.ModelAdmin):
    list_display = ("module", "alt")
    search_fields = ("module__name", "alt")


@admin.register(ProductModulesBlock)
class ProductModulesBlockAdmin(admin.ModelAdmin):
    list_display = ("product", "subtitle", "title")
    search_fields = ("product__name", "subtitle", "title")


@admin.register(ProductModulePlacement)
class ProductModulePlacementAdmin(admin.ModelAdmin):
    list_display = ("product", "module", "block", "order")
    list_filter = ("product", "block")
    search_fields = ("product__name", "module__name", "module__tag")
    ordering = ("product", "order", "id")


@admin.register(ProductTextBlock)
class ProductTextBlockAdmin(admin.ModelAdmin):
    list_display = ("product", "title", "order")
    search_fields = ("product__name", "title", "text")
    ordering = ("product", "order")
