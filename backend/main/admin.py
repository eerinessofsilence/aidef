from django.contrib import admin
from .models import (
    Product, Category, ProductImage, ProductFeature
)


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 3
    fields = ('image', 'alt', 'order')

class ProductFeatureInline(admin.TabularInline):
    model = ProductFeature
    extra = 1
    ordering = ("order",)

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
    inlines = [ProductImageInline, ProductFeatureInline]