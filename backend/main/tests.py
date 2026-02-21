import shutil
import tempfile

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from django.urls import reverse

from .models import (
    Category,
    ContactRequest,
    LinkedInPost,
    Product,
    ProductImage,
    ProductImageTranslation,
)

TEST_MEDIA_ROOT = tempfile.mkdtemp(prefix="aidef-main-admin-tests-")


@override_settings(MEDIA_ROOT=TEST_MEDIA_ROOT)
class MainAdminSmokeTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        user_model = get_user_model()
        cls.admin_user = user_model.objects.create_superuser(
            email="admin-main@example.com",
            password="admin-pass-123",
        )

        cls.category = Category.objects.create(name="Military")
        cls.product = Product.objects.create(
            name="Falcon X",
            category=cls.category,
        )
        cls.image_primary = ProductImage.objects.create(
            product=cls.product,
            image=SimpleUploadedFile(
                "main-primary.jpg",
                b"main-primary-image",
                content_type="image/jpeg",
            ),
            order=40,
        )
        cls.image_secondary = ProductImage.objects.create(
            product=cls.product,
            image=SimpleUploadedFile(
                "main-secondary.jpg",
                b"main-secondary-image",
                content_type="image/jpeg",
            ),
            order=5,
        )
        cls.contact_request = ContactRequest.objects.create(
            first_name="Alex",
            last_name="Stone",
            email="alex@example.com",
            message="Need a proposal.",
        )

    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        shutil.rmtree(TEST_MEDIA_ROOT, ignore_errors=True)

    def setUp(self):
        self.client.force_login(self.admin_user)

    def test_admin_index_has_quick_entries_and_instructions(self):
        response = self.client.get(reverse("admin:index"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Быстрые входы")
        self.assertContains(response, "Products")
        self.assertContains(response, "PortalProducts")
        self.assertContains(response, "ContactRequests")
        self.assertContains(response, "Как работать")

    def test_product_image_change_form_updates_translation_for_selected_language(self):
        change_url = reverse(
            "admin:main_productimage_change",
            args=[self.image_primary.pk],
        )
        response = self.client.get(f"{change_url}?lang=de")
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Jump to:")

        response = self.client.post(
            f"{change_url}?lang=de",
            {"alt_text": "Deutsch Alt Text", "_save": "Save"},
        )
        self.assertEqual(response.status_code, 302)

        translation = ProductImageTranslation.objects.get(
            image=self.image_primary,
            lang="de",
        )
        self.assertEqual(translation.alt, "Deutsch Alt Text")

    def test_contact_request_assign_to_me_action_sets_assignee(self):
        changelist_url = reverse("admin:main_contactrequest_changelist")
        response = self.client.post(
            changelist_url,
            {
                "action": "assign_to_me",
                "index": "0",
                "select_across": "0",
                "_selected_action": [str(self.contact_request.pk)],
            },
            follow=True,
        )
        self.assertEqual(response.status_code, 200)

        self.contact_request.refresh_from_db()
        self.assertEqual(self.contact_request.assigned_to_id, self.admin_user.id)

    def test_product_image_renumber_action_normalizes_order(self):
        changelist_url = reverse("admin:main_productimage_changelist")
        response = self.client.post(
            changelist_url,
            {
                "action": "renumber_order",
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
        orders = sorted([self.image_primary.order, self.image_secondary.order])
        self.assertEqual(orders, [10, 20])


class MainApiTests(TestCase):
    def test_linkedin_posts_api_returns_active_items_sorted_by_order(self):
        second = LinkedInPost.objects.create(
            embed_url=(
                "https://www.linkedin.com/embed/feed/update/"
                "urn:li:share:7424218069163696128?collapsed=1"
            ),
            order=20,
            is_active=True,
        )
        first = LinkedInPost.objects.create(
            embed_url=(
                "https://www.linkedin.com/embed/feed/update/"
                "urn:li:share:7424766080130125824?collapsed=1"
            ),
            order=10,
            is_active=True,
        )
        LinkedInPost.objects.create(
            embed_url=(
                "https://www.linkedin.com/embed/feed/update/"
                "urn:li:ugcPost:7424765399566655488?collapsed=1"
            ),
            order=5,
            is_active=False,
        )

        response = self.client.get(reverse("main:linkedin-post-list"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json(),
            [
                {
                    "id": first.id,
                    "embed_url": first.embed_url,
                    "order": first.order,
                },
                {
                    "id": second.id,
                    "embed_url": second.embed_url,
                    "order": second.order,
                },
            ],
        )
