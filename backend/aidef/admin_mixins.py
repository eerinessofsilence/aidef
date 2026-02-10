from django.core.exceptions import ImproperlyConfigured
from modeltranslation.admin import TabbedTranslationAdmin


class HiddenModelTranslationTabsAdmin(TabbedTranslationAdmin):
    class Media:
        css = {"all": ("admin/hide_modeltranslation_tabs.css",)}


class ProductImageLanguageTabsMixin:
    language_choices = ()
    language_codes = set()
    language_labels = {}
    default_language = "en"
    translation_model = None
    translation_fk_name = "image"
    translation_text_field = "alt"
    translation_related_name = "translations"

    def get_alt_map(self, obj):
        raise NotImplementedError

    def get_alt_coverage(self, obj):
        raise NotImplementedError

    def render_alt_links(self, obj):
        raise NotImplementedError

    def _get_language_from_request(self, request):
        raw = request.GET.get("lang", "")
        if raw:
            base = raw.split("-")[0].strip().lower()
            if base in self.language_codes:
                return base
        fallback = getattr(request, "LANGUAGE_CODE", "")
        if fallback:
            base = fallback.split("-")[0].strip().lower()
            if base in self.language_codes:
                return base
        return self.default_language

    def _build_language_tabs(self, request, current_language, obj=None):
        params = request.GET.copy()
        alt_map = self.get_alt_map(obj) if obj and obj.pk else {}
        tabs = []
        for code, label in self.language_choices:
            params["lang"] = code
            url = f"?{params.urlencode()}" if params else f"?lang={code}"
            tabs.append(
                {
                    "code": code,
                    "label": label,
                    "url": url,
                    "active": code == current_language,
                    "has_alt": bool(alt_map.get(code)),
                }
            )
        return tabs

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
        obj = self.get_object(request, object_id) if object_id else None
        extra_context["language_tabs"] = self._build_language_tabs(
            request, language, obj=obj
        )
        if obj and obj.pk:
            _, filled, missing = self.get_alt_coverage(obj)
            extra_context["coverage_summary"] = (
                f"{len(filled)}/{len(self.language_choices)} languages filled"
            )
            extra_context["missing_language_labels"] = [
                self.language_labels.get(code, code.upper()) for code in missing
            ]
        return super().changeform_view(
            request, object_id, form_url, extra_context=extra_context
        )

    def save_model(self, request, obj, form, change):
        language = self._get_language_from_request(request)
        alt_text = (form.cleaned_data.get("alt_text") or "").strip()
        if language == self.default_language:
            setattr(obj, self.translation_text_field, alt_text)
        super().save_model(request, obj, form, change)
        self._upsert_translation(obj, language, alt_text)
        obj.ensure_translations(english_alt=self._get_english_alt(obj))

    def _get_english_alt(self, obj):
        translations = getattr(obj, self.translation_related_name)
        translation = translations.filter(lang=self.default_language).first()
        if translation and getattr(translation, self.translation_text_field, ""):
            return getattr(translation, self.translation_text_field)
        value = getattr(obj, self.translation_text_field, "")
        return value or ""

    def _upsert_translation(self, obj, language, alt_text):
        if self.translation_model is None:
            raise ImproperlyConfigured(
                "ProductImageLanguageTabsMixin requires translation_model."
            )

        lookup = {self.translation_fk_name: obj, "lang": language}
        defaults = {self.translation_text_field: alt_text}
        translation, created = self.translation_model.objects.get_or_create(
            **lookup,
            defaults=defaults,
        )
        if created:
            return

        if getattr(translation, self.translation_text_field) != alt_text:
            setattr(translation, self.translation_text_field, alt_text)
            translation.save(update_fields=[self.translation_text_field])
