from django.contrib import admin
from .models import (
    Product, Category, ProductImage
)


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 3
    fields = ('image', 'alt', 'order')

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'category', 'available', 'price', 'discount', 'is_featured', 'created_at')
    list_filter = ('available', 'category', 'is_featured')
    search_fields = ('name', 'slug', 'sku')
    prepopulated_fields = {'slug': ('name',)}
    ordering = ('-is_featured', '-created_at')
    inlines = [ProductImageInline]