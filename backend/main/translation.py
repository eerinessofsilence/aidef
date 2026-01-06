from modeltranslation.translator import TranslationOptions, register

from .models import (
    Category,
    Product,
    ProductCTABlock,
    ProductFeature,
    ProductFeatureBlock,
    ProductGallery,
    ProductImage,
    ProductInfoBlock,
    ProductSubFeature,
    ProductTechnology,
)


@register(Category)
class CategoryTranslationOptions(TranslationOptions):
    fields = ("name",)


@register(Product)
class ProductTranslationOptions(TranslationOptions):
    fields = ("name", "description")


@register(ProductImage)
class ProductImageTranslationOptions(TranslationOptions):
    fields = ("alt",)


@register(ProductFeature)
class ProductFeatureTranslationOptions(TranslationOptions):
    fields = ("name", "value", "description")


@register(ProductSubFeature)
class ProductSubFeatureTranslationOptions(TranslationOptions):
    fields = ("name", "description")


@register(ProductGallery)
class ProductGalleryTranslationOptions(TranslationOptions):
    fields = ("alt",)


@register(ProductTechnology)
class ProductTechnologyTranslationOptions(TranslationOptions):
    fields = ("name", "description")


@register(ProductFeatureBlock)
class ProductFeatureBlockTranslationOptions(TranslationOptions):
    fields = ("name", "title", "description")


@register(ProductInfoBlock)
class ProductInfoBlockTranslationOptions(TranslationOptions):
    fields = ("title_1", "title_2")


@register(ProductCTABlock)
class ProductCTABlockTranslationOptions(TranslationOptions):
    fields = ("name", "title")
