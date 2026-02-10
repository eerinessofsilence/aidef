import json

from django import forms
from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html, format_html_join
from modeltranslation.admin import (
    TranslationStackedInline,
)

from aidef.admin_mixins import (
    HiddenModelTranslationTabsAdmin,
    ProductImageLanguageTabsMixin,
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
ADMIN_LIST_PER_PAGE = 50
LANGUAGE_LABELS = dict(LANGUAGE_CHOICES)
LANGUAGE_TOTAL = len(LANGUAGE_CHOICES)
ORDER_STEP = 10


def _next_order_value(queryset, *, step=ORDER_STEP):
    last_order = (
        queryset.order_by("-order", "-pk")
        .values_list("order", flat=True)
        .first()
    )
    if last_order is None:
        return step
    return ((last_order // step) + 1) * step


def _to_int(value):
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


def _format_json_for_textarea(value):
    if value in (None, "", [], {}):
        return ""
    if isinstance(value, list):
        if all(isinstance(item, (str, int, float, bool, type(None))) for item in value):
            return "\n".join(str(item) for item in value)
        return json.dumps(value, ensure_ascii=False, indent=2)
    return json.dumps(value, ensure_ascii=False, indent=2)


def _parse_json_or_lines(value, *, field_label="Field"):
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
                raw_items.extend(
                    item.strip() for item in chunk.split(",") if item.strip()
                )
    else:
        raise forms.ValidationError(
            f"{field_label}: unsupported value type."
        )
    return [str(item).strip() for item in raw_items if str(item).strip()]


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


class PortalProductAdminForm(forms.ModelForm):
    tags = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={"rows": 3}),
        help_text="One tag per line or comma-separated values.",
    )

    class Meta:
        model = PortalProduct
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.initial["tags"] = _format_json_for_textarea(self.instance.tags)

    def clean_tags(self):
        return _parse_json_or_lines(
            self.cleaned_data.get("tags"),
            field_label="Tags",
        )


class ProductImageInline(admin.StackedInline):
    # Stacked inline avoids wide tables and keeps image ordering obvious.
    model = ProductImage
    extra = 0
    fields = (
        "image_preview_inline",
        "image",
        "is_preview",
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


# Stacked translation inlines keep translated fields readable without horizontal scrolling.
class ProductGalleryInline(TranslationStackedInline):
    model = ProductGallery
    extra = 0
    fields = ("image", "alt", "order")
    ordering = ("order",)
    classes = ("collapse",)
    verbose_name_plural = "Gallery"


class ProductPresentationInfoInline(TranslationStackedInline):
    model = ProductPresentationInfo
    extra = 0
    fields = ("title", "description", "order")
    ordering = ("order",)
    classes = ("collapse",)
    verbose_name_plural = "Presentation info"


class ProductCharacteristicInline(TranslationStackedInline):
    model = ProductCharacteristic
    extra = 0
    fields = ("name", "description", "block", "order")
    ordering = ("order",)
    classes = ("collapse",)
    verbose_name_plural = "Characteristics"


class ProductCharacteristicsBlockInline(TranslationStackedInline):
    model = ProductCharacteristicsBlock
    extra = 0
    fields = ("title", "icon_type", "icon_lucide", "icon_file")
    classes = ("collapse",)
    verbose_name_plural = "Characteristic blocks"


class ProductModulePlacementInline(admin.TabularInline):
    model = ProductModulePlacement
    extra = 0
    fields = ("module", "block", "order")
    autocomplete_fields = ("module", "block")
    ordering = ("order",)
    classes = ("collapse",)
    verbose_name_plural = "Module placements"

    def get_formset(self, request, obj=None, **kwargs):
        self._parent_product = obj
        formset = super().get_formset(request, obj, **kwargs)
        initial_order = ORDER_STEP
        if obj and obj.pk:
            initial_order = _next_order_value(
                ProductModulePlacement.objects.filter(product=obj)
            )
        if "order" in formset.form.base_fields:
            formset.form.base_fields["order"].initial = initial_order
        return formset

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
    autocomplete_fields = ("product", "block")
    ordering = ("order",)
    classes = ("collapse",)
    verbose_name_plural = "Product placements"

    def get_formset(self, request, obj=None, **kwargs):
        formset = super().get_formset(request, obj, **kwargs)
        initial_order = ORDER_STEP
        if obj and obj.pk:
            initial_order = _next_order_value(
                ProductModulePlacement.objects.filter(module=obj)
            )
        if "order" in formset.form.base_fields:
            formset.form.base_fields["order"].initial = initial_order
        return formset


class ProductModuleCharacteristicInline(TranslationStackedInline):
    model = ProductModuleCharacteristic
    extra = 0
    fields = ("name", "description", "order")
    ordering = ("order",)
    classes = ("collapse",)
    verbose_name_plural = "Module characteristics"


class ProductModulesBlockInline(TranslationStackedInline):
    model = ProductModulesBlock
    extra = 0
    fields = ("subtitle", "title")
    classes = ("collapse",)
    verbose_name_plural = "Module blocks"

class ProductTextBlockInline(TranslationStackedInline):
    model = ProductTextBlock
    extra = 0
    fields = ("title", "text", "order")
    ordering = ("order",)
    classes = ("collapse",)
    verbose_name_plural = "Text blocks"


@admin.register(PortalProduct)
class PortalProductAdmin(HiddenModelTranslationTabsAdmin):
    form = PortalProductAdminForm
    list_display = (
        "name",
        "slug",
        "category",
        "serial_number",
        "order",
        "created_at",
    )
    list_display_links = ("name", "slug")
    list_editable = ("order",)
    list_filter = ("category", "created_at")
    search_fields = (
        "name",
        "slug",
        "description",
        "serial_number",
        "category__name",
    )
    prepopulated_fields = {"slug": ("name",)}
    list_select_related = ("category",)
    ordering = ("order", "-created_at")
    date_hierarchy = "created_at"
    list_per_page = ADMIN_LIST_PER_PAGE
    actions = ("renumber_order",)
    save_on_top = True
    fieldsets = (
        (
            "Main",
            {
                "fields": (
                    "name",
                    "slug",
                    "category",
                    "serial_number",
                    "order",
                ),
            },
        ),
        (
            "Content",
            {
                "fields": ("description", "tags"),
            },
        ),
    )
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


@admin.register(ProductImage)
class ProductImageAdmin(ProductImageLanguageTabsMixin, admin.ModelAdmin):
    language_choices = LANGUAGE_CHOICES
    language_codes = LANGUAGE_CODES
    language_labels = LANGUAGE_LABELS
    default_language = DEFAULT_LANGUAGE
    translation_model = ProductImageTranslation

    list_display = ("product", "alt_coverage_badge", "is_preview", "order")
    list_display_links = ("product",)
    list_editable = ("is_preview", "order")
    list_select_related = ("product",)
    list_filter = ("is_preview", "product")
    search_fields = ("product__name", "product__slug")
    ordering = ("product", "order")
    list_per_page = ADMIN_LIST_PER_PAGE
    actions = ("mark_as_preview", "clear_preview", "renumber_order")
    form = ProductImageAdminForm
    # Custom template injects an explicit language switcher.
    change_form_template = "admin/productimage_change_form.html"
    readonly_fields = ("image_preview", "translation_coverage", "alt_links")
    fields = ("image_preview", "translation_coverage", "alt_links", "alt_text")

    def has_add_permission(self, request):
        # Images are created in the Product inline to avoid technical fields here.
        return False

    @admin.action(
        description="Set selected image as preview (one per product)"
    )
    def mark_as_preview(self, request, queryset):
        selected_by_product = {}
        for image in queryset.order_by("product_id", "order", "pk"):
            selected_by_product.setdefault(image.product_id, image.pk)

        updated = 0
        for product_id, image_id in selected_by_product.items():
            ProductImage.objects.filter(product_id=product_id).exclude(
                pk=image_id
            ).update(is_preview=False)
            updated += ProductImage.objects.filter(pk=image_id).update(
                is_preview=True
            )

        self.message_user(
            request,
            f"Set preview image for {len(selected_by_product)} product(s).",
        )
        if updated == 0:
            self.message_user(request, "No preview images were updated.")

    @admin.action(description="Clear preview flag for selected images")
    def clear_preview(self, request, queryset):
        updated = queryset.update(is_preview=False)
        self.message_user(request, f"Cleared preview flag on {updated} image(s).")

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


@admin.register(ProductGallery)
class ProductGalleryAdmin(HiddenModelTranslationTabsAdmin):
    list_display = ("product", "alt", "order")
    list_display_links = ("product", "alt")
    list_editable = ("order",)
    search_fields = ("product__name", "product__slug", "alt")
    list_filter = ("product",)
    ordering = ("product", "order")
    list_per_page = ADMIN_LIST_PER_PAGE
    actions = ("renumber_order",)

    @admin.action(description="Renumber order for selected rows (step 10)")
    def renumber_order(self, request, queryset):
        updated = 0
        for index, item in enumerate(queryset.order_by("order", "pk"), start=1):
            new_order = index * 10
            if item.order != new_order:
                item.order = new_order
                item.save(update_fields=["order"])
                updated += 1
        self.message_user(request, f"Updated order for {updated} row(s).")


@admin.register(ProductPresentationInfo)
class ProductPresentationInfoAdmin(HiddenModelTranslationTabsAdmin):
    list_display = ("product", "title", "order")
    list_display_links = ("product", "title")
    list_editable = ("order",)
    search_fields = ("product__name", "product__slug", "title", "description")
    list_filter = ("product",)
    ordering = ("product", "order", "id")
    list_per_page = ADMIN_LIST_PER_PAGE
    actions = ("renumber_order",)

    @admin.action(description="Renumber order for selected rows (step 10)")
    def renumber_order(self, request, queryset):
        updated = 0
        for index, item in enumerate(queryset.order_by("order", "pk"), start=1):
            new_order = index * 10
            if item.order != new_order:
                item.order = new_order
                item.save(update_fields=["order"])
                updated += 1
        self.message_user(request, f"Updated order for {updated} row(s).")


@admin.register(ProductCharacteristicsBlock)
class ProductCharacteristicsBlockAdmin(HiddenModelTranslationTabsAdmin):
    list_display = ("product", "title", "icon_type", "icon_preview")
    search_fields = (
        "product__name",
        "product__slug",
        "title",
        "icon_lucide",
    )
    list_filter = ("icon_type", "product")
    list_per_page = ADMIN_LIST_PER_PAGE

    @admin.display(description="Icon")
    def icon_preview(self, obj):
        if obj.icon_type == IconType.LUCIDE:
            return f"lucide:{obj.icon_lucide or '-'}"
        if obj.icon_file:
            return obj.icon_file.name
        return "-"

@admin.register(ProductCharacteristic)
class ProductCharacteristicAdmin(HiddenModelTranslationTabsAdmin):
    list_display = ("product", "name", "block", "order")
    list_display_links = ("product", "name")
    list_editable = ("order",)
    list_filter = ("product", "block")
    search_fields = ("product__name", "product__slug", "name", "description")
    ordering = ("product", "order")
    list_per_page = ADMIN_LIST_PER_PAGE
    actions = ("renumber_order",)

    @admin.action(description="Renumber order for selected rows (step 10)")
    def renumber_order(self, request, queryset):
        updated = 0
        for index, item in enumerate(queryset.order_by("order", "pk"), start=1):
            new_order = index * 10
            if item.order != new_order:
                item.order = new_order
                item.save(update_fields=["order"])
                updated += 1
        self.message_user(request, f"Updated order for {updated} row(s).")


class ProductModuleImageInline(TranslationStackedInline):
    model = ProductModuleImage
    extra = 0
    fields = ("image", "alt")


@admin.register(ProductModule)
class ProductModuleAdmin(HiddenModelTranslationTabsAdmin):
    list_display = ("name", "tag", "button_text")
    search_fields = ("name", "tag", "description")
    ordering = ("name", "id")
    list_per_page = ADMIN_LIST_PER_PAGE
    inlines = [
        ProductModuleImageInline,
        ProductModuleCharacteristicInline,
        ProductModulePlacementForModuleInline,
    ]


@admin.register(ProductModuleImage)
class ProductModuleImageAdmin(HiddenModelTranslationTabsAdmin):
    list_display = ("module", "alt")
    search_fields = ("module__name", "alt")
    list_filter = ("module",)
    list_per_page = ADMIN_LIST_PER_PAGE


@admin.register(ProductModulesBlock)
class ProductModulesBlockAdmin(HiddenModelTranslationTabsAdmin):
    list_display = ("product", "subtitle", "title")
    search_fields = ("product__name", "product__slug", "subtitle", "title")
    list_filter = ("product",)
    list_per_page = ADMIN_LIST_PER_PAGE


@admin.register(ProductModulePlacement)
class ProductModulePlacementAdmin(admin.ModelAdmin):
    list_display = ("product", "module", "block", "order")
    list_display_links = ("product", "module", "block")
    list_editable = ("order",)
    list_filter = ("product", "module", "block")
    autocomplete_fields = ("product", "module", "block")
    search_fields = ("product__name", "module__name", "module__tag")
    ordering = ("product", "order", "id")
    list_per_page = ADMIN_LIST_PER_PAGE
    actions = ("renumber_order",)

    def get_changeform_initial_data(self, request):
        initial = super().get_changeform_initial_data(request)
        product_id = _to_int(request.GET.get("product"))
        module_id = _to_int(request.GET.get("module"))
        block_id = _to_int(request.GET.get("block"))

        queryset = ProductModulePlacement.objects.all()
        has_scope = False

        if product_id:
            queryset = queryset.filter(product_id=product_id)
            initial.setdefault("product", product_id)
            has_scope = True
        if module_id:
            queryset = queryset.filter(module_id=module_id)
            initial.setdefault("module", module_id)
            has_scope = True
        if block_id:
            queryset = queryset.filter(block_id=block_id)
            initial.setdefault("block", block_id)
            has_scope = True

        if has_scope:
            initial.setdefault("order", _next_order_value(queryset))
        else:
            initial.setdefault("order", ORDER_STEP)
        return initial

    @admin.action(description="Renumber order for selected rows (step 10)")
    def renumber_order(self, request, queryset):
        updated = 0
        for index, item in enumerate(queryset.order_by("order", "pk"), start=1):
            new_order = index * 10
            if item.order != new_order:
                item.order = new_order
                item.save(update_fields=["order"])
                updated += 1
        self.message_user(request, f"Updated order for {updated} row(s).")


@admin.register(ProductTextBlock)
class ProductTextBlockAdmin(HiddenModelTranslationTabsAdmin):
    list_display = ("product", "title", "order")
    list_display_links = ("product", "title")
    list_editable = ("order",)
    search_fields = ("product__name", "product__slug", "title", "text")
    list_filter = ("product",)
    ordering = ("product", "order")
    list_per_page = ADMIN_LIST_PER_PAGE
    actions = ("renumber_order",)

    @admin.action(description="Renumber order for selected rows (step 10)")
    def renumber_order(self, request, queryset):
        updated = 0
        for index, item in enumerate(queryset.order_by("order", "pk"), start=1):
            new_order = index * 10
            if item.order != new_order:
                item.order = new_order
                item.save(update_fields=["order"])
                updated += 1
        self.message_user(request, f"Updated order for {updated} row(s).")
