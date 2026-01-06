from modeltranslation.translator import TranslationOptions, register

from .models import (
    PortalProduct,
    ProductCharacteristic,
    ProductCharacteristicsBlock,
    ProductGallery,
    ProductImage,
    ProductModule,
    ProductModuleCharacteristic,
    ProductModuleImage,
    ProductModulesBlock,
    ProductPresentationInfo,
    ProductTextBlock,
)


@register(PortalProduct)
class PortalProductTranslationOptions(TranslationOptions):
    fields = ("name", "description")


@register(ProductImage)
class ProductImageTranslationOptions(TranslationOptions):
    fields = ("alt",)


@register(ProductGallery)
class ProductGalleryTranslationOptions(TranslationOptions):
    fields = ("alt",)


@register(ProductPresentationInfo)
class ProductPresentationInfoTranslationOptions(TranslationOptions):
    fields = ("title", "description")


@register(ProductCharacteristic)
class ProductCharacteristicTranslationOptions(TranslationOptions):
    fields = ("name", "description")


@register(ProductCharacteristicsBlock)
class ProductCharacteristicsBlockTranslationOptions(TranslationOptions):
    fields = ("title",)


@register(ProductModule)
class ProductModuleTranslationOptions(TranslationOptions):
    fields = ("name", "tag", "description", "button_text")


@register(ProductModuleCharacteristic)
class ProductModuleCharacteristicTranslationOptions(TranslationOptions):
    fields = ("name", "description")


@register(ProductModuleImage)
class ProductModuleImageTranslationOptions(TranslationOptions):
    fields = ("alt",)


@register(ProductModulesBlock)
class ProductModulesBlockTranslationOptions(TranslationOptions):
    fields = ("subtitle", "title")


@register(ProductTextBlock)
class ProductTextBlockTranslationOptions(TranslationOptions):
    fields = ("title", "text")
