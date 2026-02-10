import json

from django import forms
from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html, format_html_join
from django.utils import timezone
from modeltranslation.admin import TranslationStackedInline

from aidef.admin_mixins import (
    HiddenModelTranslationTabsAdmin,
    ProductImageLanguageTabsMixin,
)
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
ADMIN_LIST_PER_PAGE = 50
LANGUAGE_LABELS = dict(LANGUAGE_CHOICES)
LANGUAGE_TOTAL = len(LANGUAGE_CHOICES)


def _format_json_for_textarea(value):
    if value in (None, "", {}, []):
        return ""
    if isinstance(value, dict):
        if all(
            isinstance(key, str)
            and isinstance(item, (str, int, float, bool, type(None)))
            for key, item in value.items()
        ):
            return "\n".join(f"{key}: {item}" for key, item in value.items())
        return json.dumps(value, ensure_ascii=False, indent=2)
    if isinstance(value, list):
        if all(isinstance(item, (str, int, float, bool, type(None))) for item in value):
            return "\n".join(str(item) for item in value)
        return json.dumps(value, ensure_ascii=False, indent=2)
    return json.dumps(value, ensure_ascii=False, indent=2)


def _parse_json_or_lines(value, *, split_commas=False, field_label="Field", max_items=None):
    if value is None:
        return []
    if isinstance(value, (list, tuple)):
        raw_items = list(value)
    elif isinstance(value, str):
        text = value.strip()
        if not text:
            return []
        if text.startswith("["):
            try:
                parsed = json.loads(text)
            except json.JSONDecodeError as exc:
                raise forms.ValidationError(
                    f"{field_label}: invalid JSON array."
                ) from exc
            if not isinstance(parsed, list):
                raise forms.ValidationError(
                    f"{field_label}: use a JSON array or line-based input."
                )
            raw_items = parsed
        else:
            raw_items = []
            for line in text.splitlines():
                chunk = line.strip()
                if not chunk:
                    continue
                if split_commas:
                    raw_items.extend(
                        item.strip() for item in chunk.split(",") if item.strip()
                    )
                else:
                    raw_items.append(chunk)
    else:
        raise forms.ValidationError(
            f"{field_label}: unsupported value type."
        )

    cleaned = [str(item).strip() for item in raw_items if str(item).strip()]
    if max_items is not None and len(cleaned) > max_items:
        raise forms.ValidationError(
            f"{field_label}: no more than {max_items} items are allowed."
        )
    return cleaned


def _parse_specs_value(value):
    if value is None:
        return None
    if isinstance(value, (dict, list)):
        return value
    if not isinstance(value, str):
        raise forms.ValidationError("Specs: unsupported value type.")

    text = value.strip()
    if not text:
        return None

    if text.startswith("{") or text.startswith("["):
        try:
            parsed = json.loads(text)
        except json.JSONDecodeError as exc:
            raise forms.ValidationError(
                "Specs: invalid JSON payload."
            ) from exc
        if not isinstance(parsed, (dict, list)):
            raise forms.ValidationError(
                "Specs: root value must be JSON object or array."
            )
        return parsed

    lines = [line.strip() for line in text.splitlines() if line.strip()]
    if not lines:
        return None

    if all(":" in line for line in lines):
        result = {}
        for line in lines:
            key, raw_val = line.split(":", 1)
            key = key.strip()
            raw_val = raw_val.strip()
            if not key:
                raise forms.ValidationError(
                    "Specs: key is required for each 'key: value' row."
                )
            result[key] = raw_val
        return result

    return lines


def _safe_image_url(obj):
    if not obj or not getattr(obj, "image", None):
        return None
    try:
        return obj.image.url
    except (ValueError, AttributeError):
        return None


def _get_alt_map(obj):
    cached = getattr(obj, "_admin_alt_map_cache", None)
    if cached is not None:
        return cached

    alt_map = {code: "" for code, _ in LANGUAGE_CHOICES}
    if obj and getattr(obj, "pk", None):
        for translation in obj.translations.all():
            alt_map[translation.lang] = (translation.alt or "").strip()

    english_alt = (getattr(obj, "alt", "") or "").strip()
    if english_alt and not alt_map[DEFAULT_LANGUAGE]:
        alt_map[DEFAULT_LANGUAGE] = english_alt

    if obj is not None:
        setattr(obj, "_admin_alt_map_cache", alt_map)
    return alt_map


def _get_alt_coverage(obj):
    alt_map = _get_alt_map(obj)
    filled = [code for code, value in alt_map.items() if value]
    missing = [code for code, value in alt_map.items() if not value]
    return alt_map, filled, missing


def _render_alt_coverage_badge(obj):
    _, filled, missing = _get_alt_coverage(obj)
    summary = f"{len(filled)}/{LANGUAGE_TOTAL}"
    if missing:
        return format_html(
            '<span style="display:inline-block;padding:2px 8px;'
            'border-radius:999px;background:#fff4f4;color:#ba2121;'
            'border:1px solid #ba2121;font-weight:600;">Missing {}</span>',
            summary,
        )
    return format_html(
        '<span style="display:inline-block;padding:2px 8px;'
        'border-radius:999px;background:#edf9ed;color:#106010;'
        'border:1px solid #2f9e44;font-weight:600;">Complete {}</span>',
        summary,
    )


def _render_alt_links(obj):
    if not obj or not getattr(obj, "pk", None):
        return "Save image first to edit alt translations."

    alt_map, _, _ = _get_alt_coverage(obj)
    change_url = reverse(
        f"admin:{obj._meta.app_label}_{obj._meta.model_name}_change",
        args=[obj.pk],
    )
    links = []
    for code, _ in LANGUAGE_CHOICES:
        missing_style = "border-color:#ba2121;color:#ba2121;" if not alt_map.get(code) else ""
        links.append((missing_style, change_url, code, code.upper()))

    return format_html(
        '<div style="display:flex;flex-wrap:wrap;gap:4px;">{}</div>',
        format_html_join(
            "",
            '<a class="button" style="margin:0;{}" href="{}?lang={}">{}</a>',
            links,
        ),
    )


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


class ProductAdminForm(forms.ModelForm):
    specs = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={"rows": 6}),
        help_text=(
            "JSON object/array or line-based input. "
            "Example lines: range: 40km"
        ),
    )

    class Meta:
        model = Product
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.pk:
            self.initial["specs"] = _format_json_for_textarea(self.instance.specs)

    def clean_specs(self):
        return _parse_specs_value(self.cleaned_data.get("specs"))


class CivilProductAdminForm(forms.ModelForm):
    specs = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={"rows": 6}),
        help_text=(
            "JSON object/array or line-based input. "
            "Example lines: range: 40km"
        ),
    )

    class Meta:
        model = CivilProduct
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.pk:
            self.initial["specs"] = _format_json_for_textarea(self.instance.specs)

    def clean_specs(self):
        return _parse_specs_value(self.cleaned_data.get("specs"))


class ProductTechnologyInlineForm(forms.ModelForm):
    tags = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={"rows": 3}),
        help_text="One tag per line or comma-separated values (max 3).",
    )

    class Meta:
        model = ProductTechnology
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.initial["tags"] = _format_json_for_textarea(self.instance.tags)

    def clean_tags(self):
        return _parse_json_or_lines(
            self.cleaned_data.get("tags"),
            split_commas=True,
            field_label="Tags",
            max_items=3,
        )


class CivilProductTechnologyInlineForm(forms.ModelForm):
    tags = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={"rows": 3}),
        help_text="One tag per line or comma-separated values (max 3).",
    )

    class Meta:
        model = CivilProductTechnology
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.initial["tags"] = _format_json_for_textarea(self.instance.tags)

    def clean_tags(self):
        return _parse_json_or_lines(
            self.cleaned_data.get("tags"),
            split_commas=True,
            field_label="Tags",
            max_items=3,
        )


class ProductInfoBlockInlineForm(forms.ModelForm):
    description_1 = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={"rows": 4}),
        help_text="One bullet per line or JSON array.",
    )
    description_2 = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={"rows": 4}),
        help_text="One bullet per line or JSON array.",
    )

    class Meta:
        model = ProductInfoBlock
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.initial["description_1"] = _format_json_for_textarea(
            self.instance.description_1
        )
        self.initial["description_2"] = _format_json_for_textarea(
            self.instance.description_2
        )

    def clean_description_1(self):
        return _parse_json_or_lines(
            self.cleaned_data.get("description_1"),
            split_commas=False,
            field_label="Description 1",
        )

    def clean_description_2(self):
        return _parse_json_or_lines(
            self.cleaned_data.get("description_2"),
            split_commas=False,
            field_label="Description 2",
        )


class CivilProductInfoBlockInlineForm(forms.ModelForm):
    description_1 = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={"rows": 4}),
        help_text="One bullet per line or JSON array.",
    )
    description_2 = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={"rows": 4}),
        help_text="One bullet per line or JSON array.",
    )

    class Meta:
        model = CivilProductInfoBlock
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.initial["description_1"] = _format_json_for_textarea(
            self.instance.description_1
        )
        self.initial["description_2"] = _format_json_for_textarea(
            self.instance.description_2
        )

    def clean_description_1(self):
        return _parse_json_or_lines(
            self.cleaned_data.get("description_1"),
            split_commas=False,
            field_label="Description 1",
        )

    def clean_description_2(self):
        return _parse_json_or_lines(
            self.cleaned_data.get("description_2"),
            split_commas=False,
            field_label="Description 2",
        )


class ProductImageInline(admin.StackedInline):
    # Stacked inline avoids wide tables and keeps image ordering obvious.
    model = ProductImage
    extra = 0
    fields = (
        "image_preview_inline",
        "image",
        "order",
        "alt_coverage_inline",
        "alt_links_inline",
    )
    readonly_fields = (
        "image_preview_inline",
        "alt_coverage_inline",
        "alt_links_inline",
    )
    ordering = ("order",)
    show_change_link = True
    verbose_name_plural = "Product images"

    @admin.display(description="Preview")
    def image_preview_inline(self, obj):
        url = _safe_image_url(obj)
        if not url:
            return "-"
        return format_html(
            '<img src="{}" style="max-height:96px; max-width:160px; object-fit:contain;" />',
            url,
        )

    @admin.display(description="Alt coverage")
    def alt_coverage_inline(self, obj):
        return _render_alt_coverage_badge(obj)

    @admin.display(description="Alt links")
    def alt_links_inline(self, obj):
        return _render_alt_links(obj)


class ProductDroneSliderMediaInline(admin.StackedInline):
    model = ProductDroneSliderMedia
    extra = 0
    max_num = 1
    fields = ("image", "video")
    classes = ("collapse",)
    verbose_name_plural = "Drone slider media"


# Stacked translation inlines keep translated fields readable without horizontal scrolling.
class ProductFeatureInline(TranslationStackedInline):
    model = ProductFeature
    extra = 0
    ordering = ("order",)
    verbose_name_plural = "Key features"
    
class ProductSubFeatureInline(TranslationStackedInline):
    model = ProductSubFeature
    extra = 0
    ordering = ("order",)
    classes = ("collapse",)
    verbose_name_plural = "Sub-features"
    
class ProductGalleryInline(TranslationStackedInline):
    model = ProductGallery
    extra = 0
    ordering = ("order",)
    fields = ("image", "alt", "order")
    classes = ("collapse",)
    verbose_name_plural = "Gallery"

class ProductTechnologyInline(TranslationStackedInline):
    model = ProductTechnology
    form = ProductTechnologyInlineForm
    extra = 0
    ordering = ("order",)
    fields = ("name", "description", "tags", "order")
    classes = ("collapse",)
    verbose_name_plural = "Technologies"
    
class ProductFeatureBlockInline(TranslationStackedInline):
    model = ProductFeatureBlock
    extra = 0
    ordering = ("order",)
    fields = ("name", "title", "description", "background_image", "with_logo", "order")
    classes = ("collapse",)
    verbose_name_plural = "Feature blocks"
    
class ProductInfoBlockInline(TranslationStackedInline):
    model = ProductInfoBlock
    form = ProductInfoBlockInlineForm
    extra = 0
    ordering = ("order",)
    fields = ("title_1", "description_1", "image_1", "title_2", "description_2", "image_2", "order")
    classes = ("collapse",)
    verbose_name_plural = "Info blocks"

class ProductCTABlockInline(TranslationStackedInline):
    model = ProductCTABlock
    extra = 0
    ordering = ("order",)
    fields = ("name", "title", "background_image", "has_button", "order")
    classes = ("collapse",)
    verbose_name_plural = "CTA blocks"

@admin.register(Category)
class CategoryAdmin(HiddenModelTranslationTabsAdmin):
    list_display = ('name', 'slug')
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    list_per_page = ADMIN_LIST_PER_PAGE


@admin.register(Product)
class ProductAdmin(HiddenModelTranslationTabsAdmin):
    form = ProductAdminForm
    list_display = ('name', 'slug', 'category', 'available', 'order', 'created_at')
    list_display_links = ("name", "slug")
    list_editable = ("available", "order")
    list_filter = ('available', 'category', 'created_at')
    search_fields = ('name', 'slug', 'description', 'category__name')
    list_select_related = ("category",)
    prepopulated_fields = {'slug': ('name',)}
    ordering = ('order', '-created_at')
    date_hierarchy = "created_at"
    list_per_page = ADMIN_LIST_PER_PAGE
    actions = ("mark_available", "mark_unavailable", "renumber_order")
    save_on_top = True
    fieldsets = (
        (
            "Main",
            {
                "fields": ("name", "slug", "category", "available", "order"),
            },
        ),
        (
            "Content",
            {
                "fields": ("description", "icon"),
            },
        ),
        (
            "Advanced",
            {
                "classes": ("collapse",),
                "fields": ("specs",),
            },
        ),
    )
    inlines = [ProductImageInline, ProductDroneSliderMediaInline, ProductFeatureInline, ProductSubFeatureInline, ProductGalleryInline, ProductTechnologyInline, ProductFeatureBlockInline, ProductInfoBlockInline, ProductCTABlockInline]

    @admin.action(description="Mark selected products as available")
    def mark_available(self, request, queryset):
        updated = queryset.update(available=True)
        self.message_user(request, f"{updated} product(s) marked as available.")

    @admin.action(description="Mark selected products as unavailable")
    def mark_unavailable(self, request, queryset):
        updated = queryset.update(available=False)
        self.message_user(
            request, f"{updated} product(s) marked as unavailable."
        )

    @admin.action(description="Renumber order for selected products (step 10)")
    def renumber_order(self, request, queryset):
        updated = 0
        for index, product in enumerate(
            queryset.order_by("order", "created_at", "pk"), start=1
        ):
            new_order = index * 10
            if product.order != new_order:
                product.order = new_order
                product.save(update_fields=["order"])
                updated += 1
        self.message_user(request, f"Updated order for {updated} product(s).")


class CivilProductImageInline(admin.StackedInline):
    model = CivilProductImage
    extra = 0
    fields = (
        "image_preview_inline",
        "image",
        "alt",
        "order",
        "alt_coverage_inline",
    )
    readonly_fields = ("image_preview_inline", "alt_coverage_inline")
    ordering = ("order",)
    verbose_name_plural = "Product images"

    @admin.display(description="Preview")
    def image_preview_inline(self, obj):
        url = _safe_image_url(obj)
        if not url:
            return "-"
        return format_html(
            '<img src="{}" style="max-height:96px; max-width:160px; object-fit:contain;" />',
            url,
        )

    @admin.display(description="Alt coverage")
    def alt_coverage_inline(self, obj):
        return _render_alt_coverage_badge(obj)


class CivilProductFeatureInline(TranslationStackedInline):
    model = CivilProductFeature
    extra = 0
    ordering = ("order",)
    verbose_name_plural = "Key features"


class CivilProductSubFeatureInline(TranslationStackedInline):
    model = CivilProductSubFeature
    extra = 0
    ordering = ("order",)
    classes = ("collapse",)
    verbose_name_plural = "Sub-features"


class CivilProductGalleryInline(TranslationStackedInline):
    model = CivilProductGallery
    extra = 0
    ordering = ("order",)
    fields = ("image", "alt", "order")
    classes = ("collapse",)
    verbose_name_plural = "Gallery"


class CivilProductTechnologyInline(TranslationStackedInline):
    model = CivilProductTechnology
    form = CivilProductTechnologyInlineForm
    extra = 0
    ordering = ("order",)
    fields = ("name", "description", "tags", "order")
    classes = ("collapse",)
    verbose_name_plural = "Technologies"


class CivilProductFeatureBlockInline(TranslationStackedInline):
    model = CivilProductFeatureBlock
    extra = 0
    ordering = ("order",)
    fields = (
        "name",
        "title",
        "description",
        "background_image",
        "with_logo",
        "order",
    )
    classes = ("collapse",)
    verbose_name_plural = "Feature blocks"


class CivilProductInfoBlockInline(TranslationStackedInline):
    model = CivilProductInfoBlock
    form = CivilProductInfoBlockInlineForm
    extra = 0
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
    classes = ("collapse",)
    verbose_name_plural = "Info blocks"


class CivilProductCTABlockInline(TranslationStackedInline):
    model = CivilProductCTABlock
    extra = 0
    ordering = ("order",)
    fields = ("name", "title", "background_image", "has_button", "order")
    classes = ("collapse",)
    verbose_name_plural = "CTA blocks"


@admin.register(CivilCategory)
class CivilCategoryAdmin(HiddenModelTranslationTabsAdmin):
    list_display = ("name", "slug")
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}
    list_per_page = ADMIN_LIST_PER_PAGE


@admin.register(CivilProduct)
class CivilProductAdmin(HiddenModelTranslationTabsAdmin):
    form = CivilProductAdminForm
    list_display = ("name", "slug", "category", "available", "order", "created_at")
    list_display_links = ("name", "slug")
    list_editable = ("available", "order")
    list_filter = ("available", "category", "created_at")
    search_fields = ("name", "slug", "description", "category__name")
    list_select_related = ("category",)
    prepopulated_fields = {"slug": ("name",)}
    ordering = ("order", "-created_at")
    date_hierarchy = "created_at"
    list_per_page = ADMIN_LIST_PER_PAGE
    actions = ("mark_available", "mark_unavailable", "renumber_order")
    save_on_top = True
    fieldsets = (
        (
            "Main",
            {
                "fields": ("name", "slug", "category", "available", "order"),
            },
        ),
        (
            "Content",
            {
                "fields": ("description", "icon"),
            },
        ),
        (
            "Advanced",
            {
                "classes": ("collapse",),
                "fields": ("specs",),
            },
        ),
    )
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

    @admin.action(description="Mark selected civil products as available")
    def mark_available(self, request, queryset):
        updated = queryset.update(available=True)
        self.message_user(
            request, f"{updated} civil product(s) marked as available."
        )

    @admin.action(description="Mark selected civil products as unavailable")
    def mark_unavailable(self, request, queryset):
        updated = queryset.update(available=False)
        self.message_user(
            request, f"{updated} civil product(s) marked as unavailable."
        )

    @admin.action(
        description="Renumber order for selected civil products (step 10)"
    )
    def renumber_order(self, request, queryset):
        updated = 0
        for index, product in enumerate(
            queryset.order_by("order", "created_at", "pk"), start=1
        ):
            new_order = index * 10
            if product.order != new_order:
                product.order = new_order
                product.save(update_fields=["order"])
                updated += 1
        self.message_user(
            request, f"Updated order for {updated} civil product(s)."
        )


@admin.register(ContactRequest)
class ContactRequestAdmin(admin.ModelAdmin):
    list_display = (
        "created_at",
        "status",
        "assigned_to",
        "variant",
        "full_name",
        "email",
        "product",
        "country_code",
        "message_preview",
    )
    list_display_links = ("created_at", "email")
    list_editable = ("status", "assigned_to")
    list_filter = (
        "status",
        "assigned_to",
        "variant",
        "created_at",
        "language",
        "country_code",
    )
    search_fields = (
        "first_name",
        "last_name",
        "email",
        "internal_note",
        "phone",
        "message",
        "product",
        "country_name",
        "country_code",
        "website",
        "source",
        "ip_address",
        "user_agent",
    )
    date_hierarchy = "created_at"
    list_per_page = ADMIN_LIST_PER_PAGE
    actions = (
        "assign_to_me",
        "clear_assignee",
        "mark_new",
        "mark_in_progress",
        "mark_done",
        "mark_spam",
    )
    readonly_fields = (
        "created_at",
        "updated_at",
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
    fieldsets = (
        (
            "Workflow",
            {
                "fields": (
                    "status",
                    "assigned_to",
                    "internal_note",
                    "created_at",
                    "updated_at",
                ),
            },
        ),
        (
            "Contact Details",
            {
                "fields": (
                    "variant",
                    "first_name",
                    "last_name",
                    "email",
                    "phone",
                    "product",
                    "message",
                ),
            },
        ),
        (
            "Location",
            {
                "classes": ("collapse",),
                "fields": (
                    "country_code",
                    "country_name",
                    "address_line1",
                    "address_line2",
                    "address_line3",
                    "website",
                ),
            },
        ),
        (
            "Technical Metadata",
            {
                "classes": ("collapse",),
                "fields": ("source", "language", "ip_address", "user_agent"),
            },
        ),
    )

    @admin.display(description="Name")
    def full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()

    @admin.display(description="Message")
    def message_preview(self, obj):
        text = (obj.message or "").strip()
        if not text:
            return "-"
        return text if len(text) <= 60 else f"{text[:57]}..."

    def _bulk_set_status(self, request, queryset, status):
        updated = queryset.update(status=status, updated_at=timezone.now())
        self.message_user(
            request,
            f"Updated status for {updated} request(s) to '{status}'.",
        )

    @admin.action(description="Assign selected requests to me")
    def assign_to_me(self, request, queryset):
        if not request.user.is_authenticated:
            self.message_user(request, "Unable to assign: current user is anonymous.")
            return
        updated = queryset.update(
            assigned_to=request.user,
            updated_at=timezone.now(),
        )
        self.message_user(request, f"Assigned {updated} request(s) to you.")

    @admin.action(description="Clear assignee for selected requests")
    def clear_assignee(self, request, queryset):
        updated = queryset.update(assigned_to=None, updated_at=timezone.now())
        self.message_user(request, f"Cleared assignee for {updated} request(s).")

    @admin.action(description="Mark selected requests as New")
    def mark_new(self, request, queryset):
        self._bulk_set_status(request, queryset, ContactRequest.Status.NEW)

    @admin.action(description="Mark selected requests as In progress")
    def mark_in_progress(self, request, queryset):
        self._bulk_set_status(
            request, queryset, ContactRequest.Status.IN_PROGRESS
        )

    @admin.action(description="Mark selected requests as Done")
    def mark_done(self, request, queryset):
        self._bulk_set_status(request, queryset, ContactRequest.Status.DONE)

    @admin.action(description="Mark selected requests as Spam")
    def mark_spam(self, request, queryset):
        self._bulk_set_status(request, queryset, ContactRequest.Status.SPAM)


@admin.register(ProductImage)
class ProductImageAdmin(ProductImageLanguageTabsMixin, admin.ModelAdmin):
    language_choices = LANGUAGE_CHOICES
    language_codes = LANGUAGE_CODES
    language_labels = LANGUAGE_LABELS
    default_language = DEFAULT_LANGUAGE
    translation_model = ProductImageTranslation

    list_display = ("product", "alt_coverage_badge", "order")
    list_display_links = ("product",)
    list_editable = ("order",)
    list_select_related = ("product",)
    list_filter = ("product",)
    search_fields = ("product__name", "product__slug")
    ordering = ("product", "order")
    list_per_page = ADMIN_LIST_PER_PAGE
    actions = ("renumber_order",)
    form = ProductImageAdminForm
    # Custom template injects an explicit language switcher.
    change_form_template = "admin/productimage_change_form.html"
    readonly_fields = ("image_preview", "translation_coverage", "alt_links")
    fields = ("image_preview", "translation_coverage", "alt_links", "alt_text")

    def has_add_permission(self, request):
        # Images are created in the Product inline to avoid technical fields here.
        return False

    @admin.action(
        description="Renumber image order for selected products (step 10)"
    )
    def renumber_order(self, request, queryset):
        updated = 0
        product_ids = queryset.values_list("product_id", flat=True).distinct()
        for product_id in product_ids:
            images = ProductImage.objects.filter(product_id=product_id).order_by(
                "order", "pk"
            )
            for index, image in enumerate(images, start=1):
                new_order = index * 10
                if image.order != new_order:
                    image.order = new_order
                    image.save(update_fields=["order"])
                    updated += 1
        self.message_user(request, f"Updated order for {updated} image(s).")

    def get_alt_map(self, obj):
        return _get_alt_map(obj)

    def get_alt_coverage(self, obj):
        return _get_alt_coverage(obj)

    def render_alt_links(self, obj):
        return _render_alt_links(obj)

    @admin.display(description="Image")
    def image_preview(self, obj):
        url = _safe_image_url(obj)
        if not url:
            return "-"
        return format_html(
            '<img src="{}" style="max-height: 180px; max-width: 100%; object-fit: contain;" />',
            url,
        )

    @admin.display(description="Alt coverage")
    def alt_coverage_badge(self, obj):
        return _render_alt_coverage_badge(obj)

    @admin.display(description="Translations")
    def translation_coverage(self, obj):
        _, filled, missing = _get_alt_coverage(obj)
        missing_labels = [LANGUAGE_LABELS[code] for code in missing]
        if missing_labels:
            return format_html(
                '<div>{}<br /><span style="color:#ba2121;">Missing: {}</span></div>',
                _render_alt_coverage_badge(obj),
                ", ".join(missing_labels),
            )
        return format_html(
            '<div>{}<br /><span style="color:#106010;">All language alt texts are filled.</span></div>',
            _render_alt_coverage_badge(obj),
        )

    @admin.display(description="Jump To Language")
    def alt_links(self, obj):
        return self.render_alt_links(obj)
