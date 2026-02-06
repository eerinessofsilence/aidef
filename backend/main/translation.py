from modeltranslation.translator import TranslationOptions, register

from .models import (
    Category,
    CivilCategory,
    CivilProduct,
    CivilProductCTABlock,
    CivilProductFeature,
    CivilProductFeatureBlock,
    CivilProductGallery,
    CivilProductInfoBlock,
    CivilProductSubFeature,
    CivilProductTechnology,
    Product,
    ProductCTABlock,
    ProductFeature,
    ProductFeatureBlock,
    ProductGallery,
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


@register(CivilCategory)
class CivilCategoryTranslationOptions(TranslationOptions):
    fields = ("name",)


@register(CivilProduct)
class CivilProductTranslationOptions(TranslationOptions):
    fields = ("name", "description")


@register(CivilProductFeature)
class CivilProductFeatureTranslationOptions(TranslationOptions):
    fields = ("name", "value", "description")


@register(CivilProductSubFeature)
class CivilProductSubFeatureTranslationOptions(TranslationOptions):
    fields = ("name", "description")


@register(CivilProductGallery)
class CivilProductGalleryTranslationOptions(TranslationOptions):
    fields = ("alt",)


@register(CivilProductTechnology)
class CivilProductTechnologyTranslationOptions(TranslationOptions):
    fields = ("name", "description")


@register(CivilProductFeatureBlock)
class CivilProductFeatureBlockTranslationOptions(TranslationOptions):
    fields = ("name", "title", "description")


@register(CivilProductInfoBlock)
class CivilProductInfoBlockTranslationOptions(TranslationOptions):
    fields = ("title_1", "title_2")


@register(CivilProductCTABlock)
class CivilProductCTABlockTranslationOptions(TranslationOptions):
    fields = ("name", "title")
