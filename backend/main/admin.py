from django.contrib import admin
from .models import (
    Product,
    Category,
    ProductImage,
    ProductFeature,
    ProductSubFeature,
    ProductGallery,
    ProductTechnology,
    ProductFeatureBlock,
    ProductInfoBlock,
    ProductCTABlock
)


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 3
    fields = ('image', 'alt', 'order')

class ProductFeatureInline(admin.TabularInline):
    model = ProductFeature
    extra = 1
    ordering = ("order",)
    
class ProductSubFeatureInline(admin.TabularInline):
    model = ProductSubFeature
    extra = 1
    ordering = ("order",)
    
class ProductGalleryInline(admin.TabularInline):
    model = ProductGallery
    extra = 1
    ordering = ("order",)
    fields = ("image", "alt", "order")

class ProductTechnologyInline(admin.TabularInline):
    model = ProductTechnology
    extra = 1
    ordering = ("order",)
    fields = ("name", "description", "tags", "order")
    
class ProductFeatureBlockInline(admin.TabularInline):
    model = ProductFeatureBlock
    extra = 1
    ordering = ("order",)
    fields = ("name", "title", "description", "background_image", "with_logo", "order")
    
class ProductInfoBlockInline(admin.TabularInline):
    model = ProductInfoBlock
    extra = 1
    ordering = ("order",)
    fields = ("title_1", "description_1", "image_1", "title_2", "description_2", "image_2", "order")

class ProductCTABlockInline(admin.TabularInline):
    model = ProductCTABlock
    extra = 1
    ordering = ("order",)
    fields = ("name", "title", "background_image", "has_button", "order")

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'category', 'available', 'is_featured', 'created_at')
    list_filter = ('available', 'category', 'is_featured')
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    ordering = ('-is_featured', '-created_at')
    inlines = [ProductImageInline, ProductFeatureInline, ProductSubFeatureInline, ProductGalleryInline, ProductTechnologyInline, ProductFeatureBlockInline, ProductInfoBlockInline, ProductCTABlockInline]
