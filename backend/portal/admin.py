from django import forms
from django.contrib import admin
from django.utils.html import format_html
from modeltranslation.admin import (
    TabbedTranslationAdmin,
    TranslationStackedInline,
)

from .models import (
    PortalProduct,
    ProductImage,
    ProductImageTranslation,
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
    fields = ("image", "is_preview", "order")
    ordering = ("order",)
    show_change_link = True


# Stacked translation inlines keep translated fields readable without horizontal scrolling.
class ProductGalleryInline(TranslationStackedInline):
    model = ProductGallery
    extra = 0
    fields = ("image", "alt", "order")
    ordering = ("order",)


class ProductPresentationInfoInline(TranslationStackedInline):
    model = ProductPresentationInfo
    extra = 0
    fields = ("title", "description", "order")
    ordering = ("order",)


class ProductCharacteristicInline(TranslationStackedInline):
    model = ProductCharacteristic
    extra = 0
    fields = ("name", "description", "block", "order")
    ordering = ("order",)


class ProductCharacteristicsBlockInline(TranslationStackedInline):
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


class ProductModuleCharacteristicInline(TranslationStackedInline):
    model = ProductModuleCharacteristic
    extra = 0
    fields = ("name", "description", "order")
    ordering = ("order",)


class ProductModulesBlockInline(TranslationStackedInline):
    model = ProductModulesBlock
    extra = 0
    fields = ("subtitle", "title")

class ProductTextBlockInline(TranslationStackedInline):
    model = ProductTextBlock
    extra = 0
    fields = ("title", "text", "order")
    ordering = ("order",)


@admin.register(PortalProduct)
class PortalProductAdmin(TabbedTranslationAdmin):
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
    list_display = ("product", "is_preview", "order")
    list_filter = ("is_preview",)
    search_fields = ("product__name",)
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


@admin.register(ProductGallery)
class ProductGalleryAdmin(TabbedTranslationAdmin):
    list_display = ("product", "alt", "order")
    search_fields = ("product__name", "alt")
    ordering = ("product", "order")


@admin.register(ProductPresentationInfo)
class ProductPresentationInfoAdmin(TabbedTranslationAdmin):
    list_display = ("product", "title", "order")
    search_fields = ("product__name", "title", "description")
    ordering = ("product", "order", "id")


@admin.register(ProductCharacteristicsBlock)
class ProductCharacteristicsBlockAdmin(TabbedTranslationAdmin):
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
class ProductCharacteristicAdmin(TabbedTranslationAdmin):
    list_display = ("product", "name", "block", "order")
    list_filter = ("block",)
    search_fields = ("product__name", "name", "description")
    ordering = ("product", "order")


class ProductModuleImageInline(TranslationStackedInline):
    model = ProductModuleImage
    extra = 0
    fields = ("image", "alt")


@admin.register(ProductModule)
class ProductModuleAdmin(TabbedTranslationAdmin):
    list_display = ("name", "tag", "button_text")
    search_fields = ("name", "tag", "description")
    ordering = ("name", "id")
    inlines = [
        ProductModuleImageInline,
        ProductModuleCharacteristicInline,
        ProductModulePlacementForModuleInline,
    ]


@admin.register(ProductModuleImage)
class ProductModuleImageAdmin(TabbedTranslationAdmin):
    list_display = ("module", "alt")
    search_fields = ("module__name", "alt")


@admin.register(ProductModulesBlock)
class ProductModulesBlockAdmin(TabbedTranslationAdmin):
    list_display = ("product", "subtitle", "title")
    search_fields = ("product__name", "subtitle", "title")


@admin.register(ProductModulePlacement)
class ProductModulePlacementAdmin(admin.ModelAdmin):
    list_display = ("product", "module", "block", "order")
    list_filter = ("product", "block")
    search_fields = ("product__name", "module__name", "module__tag")
    ordering = ("product", "order", "id")


@admin.register(ProductTextBlock)
class ProductTextBlockAdmin(TabbedTranslationAdmin):
    list_display = ("product", "title", "order")
    search_fields = ("product__name", "title", "text")
    ordering = ("product", "order")
