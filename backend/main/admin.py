from django.contrib import admin
from modeltranslation.admin import TranslationAdmin, TranslationTabularInline
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


class ProductImageInline(TranslationTabularInline):
    model = ProductImage
    extra = 3
    fields = ('image', 'alt', 'order')

class ProductFeatureInline(TranslationTabularInline):
    model = ProductFeature
    extra = 1
    ordering = ("order",)
    
class ProductSubFeatureInline(TranslationTabularInline):
    model = ProductSubFeature
    extra = 1
    ordering = ("order",)
    
class ProductGalleryInline(TranslationTabularInline):
    model = ProductGallery
    extra = 1
    ordering = ("order",)
    fields = ("image", "alt", "order")

class ProductTechnologyInline(TranslationTabularInline):
    model = ProductTechnology
    extra = 1
    ordering = ("order",)
    fields = ("name", "description", "tags", "order")
    
class ProductFeatureBlockInline(TranslationTabularInline):
    model = ProductFeatureBlock
    extra = 1
    ordering = ("order",)
    fields = ("name", "title", "description", "background_image", "with_logo", "order")
    
class ProductInfoBlockInline(TranslationTabularInline):
    model = ProductInfoBlock
    extra = 1
    ordering = ("order",)
    fields = ("title_1", "description_1", "image_1", "title_2", "description_2", "image_2", "order")

class ProductCTABlockInline(TranslationTabularInline):
    model = ProductCTABlock
    extra = 1
    ordering = ("order",)
    fields = ("name", "title", "background_image", "has_button", "order")

@admin.register(Category)
class CategoryAdmin(TranslationAdmin):
    list_display = ('name', 'slug')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Product)
class ProductAdmin(TranslationAdmin):
    list_display = ('name', 'slug', 'category', 'available', 'order', 'created_at')
    list_filter = ('available', 'category', 'order')
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    ordering = ('order', '-created_at')
    inlines = [ProductImageInline, ProductFeatureInline, ProductSubFeatureInline, ProductGalleryInline, ProductTechnologyInline, ProductFeatureBlockInline, ProductInfoBlockInline, ProductCTABlockInline]
