import shutil
import tempfile

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from django.urls import reverse

from main.models import Category
from .models import PortalProduct, ProductImage, ProductImageTranslation

TEST_MEDIA_ROOT = tempfile.mkdtemp(prefix="aidef-portal-admin-tests-")


@override_settings(MEDIA_ROOT=TEST_MEDIA_ROOT)
class PortalAdminSmokeTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        user_model = get_user_model()
        cls.admin_user = user_model.objects.create_superuser(
            email="admin-portal@example.com",
            password="admin-pass-123",
        )

        cls.category = Category.objects.create(name="Portal")
        cls.product = PortalProduct.objects.create(
            name="Swift X8",
            category=cls.category,
        )
        cls.image_primary = ProductImage.objects.create(
            product=cls.product,
            image=SimpleUploadedFile(
                "portal-primary.jpg",
                b"portal-primary-image",
                content_type="image/jpeg",
            ),
            order=20,
            is_preview=True,
        )
        cls.image_secondary = ProductImage.objects.create(
            product=cls.product,
            image=SimpleUploadedFile(
                "portal-secondary.jpg",
                b"portal-secondary-image",
                content_type="image/jpeg",
            ),
            order=5,
            is_preview=False,
        )

    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        shutil.rmtree(TEST_MEDIA_ROOT, ignore_errors=True)

    def setUp(self):
        self.client.force_login(self.admin_user)

    def test_product_image_change_form_updates_translation_for_selected_language(self):
        change_url = reverse(
            "admin:portal_productimage_change",
            args=[self.image_primary.pk],
        )
        response = self.client.get(f"{change_url}?lang=fr")
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'class="submit-row__language-select"', html=False)
        self.assertNotContains(response, "Jump To Language")

        response = self.client.post(
            f"{change_url}?lang=fr",
            {"alt_text": "Texte alternatif", "_save": "Save"},
        )
        self.assertEqual(response.status_code, 302)

        translation = ProductImageTranslation.objects.get(
            image=self.image_primary,
            lang="fr",
        )
        self.assertEqual(translation.alt, "Texte alternatif")

    def test_portal_product_change_form_renders_language_switcher(self):
        change_url = reverse(
            "admin:portal_portalproduct_change",
            args=[self.product.pk],
        )
        response = self.client.get(f"{change_url}?lang=it")
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'class="submit-row__language-select"', html=False)
        self.assertContains(response, '<option value="?lang=it" selected>IT</option>', html=True)

    def test_mark_as_preview_action_sets_single_preview_per_product(self):
        changelist_url = reverse("admin:portal_productimage_changelist")
        response = self.client.post(
            changelist_url,
            {
                "action": "mark_as_preview",
                "index": "0",
                "select_across": "0",
                "_selected_action": [str(self.image_secondary.pk)],
            },
            follow=True,
        )
        self.assertEqual(response.status_code, 200)

        self.image_primary.refresh_from_db()
        self.image_secondary.refresh_from_db()
        self.assertFalse(self.image_primary.is_preview)
        self.assertTrue(self.image_secondary.is_preview)

    def test_clear_preview_action_resets_selected_rows(self):
        self.image_secondary.is_preview = True
        self.image_secondary.save(update_fields=["is_preview"])

        changelist_url = reverse("admin:portal_productimage_changelist")
        response = self.client.post(
            changelist_url,
            {
                "action": "clear_preview",
                "index": "0",
                "select_across": "0",
                "_selected_action": [
                    str(self.image_primary.pk),
                    str(self.image_secondary.pk),
                ],
            },
            follow=True,
        )
        self.assertEqual(response.status_code, 200)

        self.image_primary.refresh_from_db()
        self.image_secondary.refresh_from_db()
        self.assertFalse(self.image_primary.is_preview)
        self.assertFalse(self.image_secondary.is_preview)
