from django.contrib import admin
from .models import (
    Product,
    Category,
    ProductImage,
    ProductFeature,
    ProductSubFeature,
    ProductTechnology,
    ProductHeroFeatureBlock
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

class ProductTechnologyInline(admin.TabularInline):
    model = ProductTechnology
    extra = 1
    ordering = ("order",)
    fields = ("name", "description", "tags", "order")
    
class ProductHeroFeatureBlockInline(admin.TabularInline):
    model = ProductHeroFeatureBlock
    extra = 1
    ordering = ("order",)
    fields = ("name", "title", "description", "background_image", "order")

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
    inlines = [ProductImageInline, ProductFeatureInline, ProductSubFeatureInline, ProductTechnologyInline, ProductHeroFeatureBlockInline]
