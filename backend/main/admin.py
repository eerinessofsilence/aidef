from django import forms
from django.contrib import admin
from django.utils.html import format_html
from modeltranslation.admin import TabbedTranslationAdmin, TranslationStackedInline
from .models import (
    Category,
    CivilCategory,
    CivilProduct,
    CivilProductCTABlock,
    CivilProductFeature,
    CivilProductFeatureBlock,
    CivilProductGallery,
    CivilProductImage,
    CivilProductInfoBlock,
    CivilProductSubFeature,
    CivilProductTechnology,
    ContactRequest,
    Product,
    ProductCTABlock,
    ProductDroneSliderMedia,
    ProductFeature,
    ProductFeatureBlock,
    ProductGallery,
    ProductImage,
    ProductImageTranslation,
    ProductInfoBlock,
    ProductSubFeature,
    ProductTechnology,
)

LANGUAGE_CHOICES = (
    ("en", "English"),
    ("de", "Deutsch"),
    ("sk", "Slovak"),
    ("es", "Spanish"),
    ("fr", "French"),
    ("it", "Italian"),
)
LANGUAGE_CODES = {code for code, _ in LANGUAGE_CHOICES}
DEFAULT_LANGUAGE = "en"


class ProductImageAdminForm(forms.ModelForm):
    # Keep ProductImage edits focused on a single alt text field.
    alt_text = forms.CharField(label="Alt text", max_length=255, required=False)

    class Meta:
        model = ProductImage
        fields = ()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        language = getattr(self, "language", DEFAULT_LANGUAGE)
        if not self.instance or not self.instance.pk:
            return
        translation = self.instance.translations.filter(lang=language).first()
        if translation is not None:
            self.initial["alt_text"] = translation.alt
            return
        fallback = self.instance.translations.filter(
            lang=DEFAULT_LANGUAGE
        ).first()
        if fallback and fallback.alt:
            self.initial["alt_text"] = fallback.alt
            return
        if self.instance.alt:
            self.initial["alt_text"] = self.instance.alt


class ProductImageInline(admin.StackedInline):
    # Stacked inline avoids wide tables and keeps image ordering obvious.
    model = ProductImage
    extra = 0
    fields = ("image", "order")
    ordering = ("order",)
    show_change_link = True


class ProductDroneSliderMediaInline(admin.StackedInline):
    model = ProductDroneSliderMedia
    extra = 1
    max_num = 1
    fields = ("image", "video")


# Stacked translation inlines keep translated fields readable without horizontal scrolling.
class ProductFeatureInline(TranslationStackedInline):
    model = ProductFeature
    extra = 1
    ordering = ("order",)
    
class ProductSubFeatureInline(TranslationStackedInline):
    model = ProductSubFeature
    extra = 1
    ordering = ("order",)
    
class ProductGalleryInline(TranslationStackedInline):
    model = ProductGallery
    extra = 1
    ordering = ("order",)
    fields = ("image", "alt", "order")

class ProductTechnologyInline(TranslationStackedInline):
    model = ProductTechnology
    extra = 1
    ordering = ("order",)
    fields = ("name", "description", "tags", "order")
    
class ProductFeatureBlockInline(TranslationStackedInline):
    model = ProductFeatureBlock
    extra = 1
    ordering = ("order",)
    fields = ("name", "title", "description", "background_image", "with_logo", "order")
    
class ProductInfoBlockInline(TranslationStackedInline):
    model = ProductInfoBlock
    extra = 1
    ordering = ("order",)
    fields = ("title_1", "description_1", "image_1", "title_2", "description_2", "image_2", "order")

class ProductCTABlockInline(TranslationStackedInline):
    model = ProductCTABlock
    extra = 1
    ordering = ("order",)
    fields = ("name", "title", "background_image", "has_button", "order")

@admin.register(Category)
class CategoryAdmin(TabbedTranslationAdmin):
    list_display = ('name', 'slug')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Product)
class ProductAdmin(TabbedTranslationAdmin):
    list_display = ('name', 'slug', 'category', 'available', 'order', 'created_at')
    list_filter = ('available', 'category', 'order')
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    ordering = ('order', '-created_at')
    inlines = [ProductImageInline, ProductDroneSliderMediaInline, ProductFeatureInline, ProductSubFeatureInline, ProductGalleryInline, ProductTechnologyInline, ProductFeatureBlockInline, ProductInfoBlockInline, ProductCTABlockInline]


class CivilProductImageInline(admin.StackedInline):
    model = CivilProductImage
    extra = 0
    fields = ("image", "alt", "order")
    ordering = ("order",)


class CivilProductFeatureInline(TranslationStackedInline):
    model = CivilProductFeature
    extra = 1
    ordering = ("order",)


class CivilProductSubFeatureInline(TranslationStackedInline):
    model = CivilProductSubFeature
    extra = 1
    ordering = ("order",)


class CivilProductGalleryInline(TranslationStackedInline):
    model = CivilProductGallery
    extra = 1
    ordering = ("order",)
    fields = ("image", "alt", "order")


class CivilProductTechnologyInline(TranslationStackedInline):
    model = CivilProductTechnology
    extra = 1
    ordering = ("order",)
    fields = ("name", "description", "tags", "order")


class CivilProductFeatureBlockInline(TranslationStackedInline):
    model = CivilProductFeatureBlock
    extra = 1
    ordering = ("order",)
    fields = (
        "name",
        "title",
        "description",
        "background_image",
        "with_logo",
        "order",
    )


class CivilProductInfoBlockInline(TranslationStackedInline):
    model = CivilProductInfoBlock
    extra = 1
    ordering = ("order",)
    fields = (
        "title_1",
        "description_1",
        "image_1",
        "title_2",
        "description_2",
        "image_2",
        "order",
    )


class CivilProductCTABlockInline(TranslationStackedInline):
    model = CivilProductCTABlock
    extra = 1
    ordering = ("order",)
    fields = ("name", "title", "background_image", "has_button", "order")


@admin.register(CivilCategory)
class CivilCategoryAdmin(TabbedTranslationAdmin):
    list_display = ("name", "slug")
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}


@admin.register(CivilProduct)
class CivilProductAdmin(TabbedTranslationAdmin):
    list_display = ("name", "slug", "category", "available", "order", "created_at")
    list_filter = ("available", "category", "order")
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}
    ordering = ("order", "-created_at")
    inlines = [
        CivilProductImageInline,
        CivilProductFeatureInline,
        CivilProductSubFeatureInline,
        CivilProductGalleryInline,
        CivilProductTechnologyInline,
        CivilProductFeatureBlockInline,
        CivilProductInfoBlockInline,
        CivilProductCTABlockInline,
    ]


@admin.register(ContactRequest)
class ContactRequestAdmin(admin.ModelAdmin):
    list_display = (
        "created_at",
        "variant",
        "first_name",
        "last_name",
        "email",
        "product",
        "country_code",
    )
    list_filter = ("variant", "created_at")
    search_fields = (
        "first_name",
        "last_name",
        "email",
        "message",
        "product",
        "country_name",
        "country_code",
    )
    readonly_fields = (
        "created_at",
        "variant",
        "first_name",
        "last_name",
        "email",
        "phone",
        "product",
        "country_code",
        "country_name",
        "address_line1",
        "address_line2",
        "address_line3",
        "website",
        "message",
        "source",
        "language",
        "ip_address",
        "user_agent",
    )


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ("product", "order")
    list_select_related = ("product",)
    ordering = ("product", "order")
    form = ProductImageAdminForm
    # Custom template injects an explicit language switcher.
    change_form_template = "admin/productimage_change_form.html"
    readonly_fields = ("image_preview",)
    fields = ("image_preview", "alt_text")

    def has_add_permission(self, request):
        # Images are created in the Product inline to avoid technical fields here.
        return False

    def get_form(self, request, obj=None, **kwargs):
        base_form = super().get_form(request, obj=obj, **kwargs)
        language = self._get_language_from_request(request)

        class LanguageBoundForm(base_form):
            pass

        LanguageBoundForm.language = language
        return LanguageBoundForm

    def changeform_view(self, request, object_id=None, form_url="", extra_context=None):
        extra_context = extra_context or {}
        language = self._get_language_from_request(request)
        extra_context["language_tabs"] = self._build_language_tabs(
            request, language
        )
        return super().changeform_view(
            request, object_id, form_url, extra_context=extra_context
        )

    def save_model(self, request, obj, form, change):
        language = self._get_language_from_request(request)
        alt_text = (form.cleaned_data.get("alt_text") or "").strip()
        if language == DEFAULT_LANGUAGE:
            obj.alt = alt_text
        super().save_model(request, obj, form, change)
        self._upsert_translation(obj, language, alt_text)
        english_alt = self._get_english_alt(obj)
        obj.ensure_translations(english_alt=english_alt)

    @admin.display(description="Image")
    def image_preview(self, obj):
        if not obj or not obj.image:
            return "-"
        try:
            url = obj.image.url
        except (ValueError, AttributeError):
            return "-"
        return format_html(
            '<img src="{}" style="max-height: 180px; max-width: 100%; object-fit: contain;" />',
            url,
        )

    def _get_language_from_request(self, request):
        raw = request.GET.get("lang", "")
        if raw:
            base = raw.split("-")[0].strip().lower()
            if base in LANGUAGE_CODES:
                return base
        fallback = getattr(request, "LANGUAGE_CODE", "")
        if fallback:
            base = fallback.split("-")[0].strip().lower()
            if base in LANGUAGE_CODES:
                return base
        return DEFAULT_LANGUAGE

    def _build_language_tabs(self, request, current_language):
        params = request.GET.copy()
        tabs = []
        for code, label in LANGUAGE_CHOICES:
            params["lang"] = code
            url = f"?{params.urlencode()}" if params else f"?lang={code}"
            tabs.append(
                {
                    "code": code,
                    "label": label,
                    "url": url,
                    "active": code == current_language,
                }
            )
        return tabs

    def _get_english_alt(self, obj):
        translation = obj.translations.filter(lang=DEFAULT_LANGUAGE).first()
        if translation and translation.alt:
            return translation.alt
        if obj.alt:
            return obj.alt
        return ""

    def _upsert_translation(self, obj, language, alt_text):
        translation, created = ProductImageTranslation.objects.get_or_create(
            image=obj,
            lang=language,
            defaults={"alt": alt_text},
        )
        if not created and translation.alt != alt_text:
            translation.alt = alt_text
            translation.save(update_fields=["alt"])
