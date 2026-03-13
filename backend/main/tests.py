import json
from datetime import date
import shutil
import tempfile
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.core import mail
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from django.urls import reverse

from .models import (
    BlogAuthor,
    BlogCategory,
    BlogPost,
    BlogPostBlock,
    BlogPostSection,
    Category,
    ContactRequest,
    Product,
    ProductFinalCTABlock,
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
        self.assertContains(response, 'class="submit-row__language-select"', html=False)
        self.assertNotContains(response, "Jump To Language")

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

    def test_category_change_form_renders_language_switcher(self):
        change_url = reverse(
            "admin:main_category_change",
            args=[self.category.pk],
        )
        response = self.client.get(f"{change_url}?lang=sk")
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'class="submit-row__language-select"', html=False)
        self.assertContains(response, '<option value="?lang=sk" selected>SK</option>', html=True)

    def test_admin_language_switcher_does_not_change_admin_locale(self):
        change_url = reverse(
            "admin:main_category_change",
            args=[self.category.pk],
        )
        response = self.client.get(f"{change_url}?lang=de")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.wsgi_request.LANGUAGE_CODE, "en")
        self.assertContains(
            response,
            'value="Save and continue editing"',
            html=False,
        )
        self.assertContains(response, 'aria-label="Language"', html=False)

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

    def test_item_list_api_includes_dropdown_image(self):
        self.product.dropdown_image = SimpleUploadedFile(
            "menu-card.jpg",
            b"menu-card-image",
            content_type="image/jpeg",
        )
        self.product.save()

        response = self.client.get(reverse("main:item-list"))
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        item = next(entry for entry in payload if entry["id"] == self.product.id)

        self.assertIn("dropdown_image", item)
        self.assertIsNotNone(item["dropdown_image"])
        self.assertIn("menu-card.jpg", item["dropdown_image"]["url"])
        self.assertEqual(item["dropdown_image"]["alt"], self.product.name)

    def test_blog_post_admin_change_form_renders_blocks_inline(self):
        blog_category = BlogCategory.objects.create(name="Resume Tips")
        blog_author = BlogAuthor.objects.create(
            name="Andrew Scott",
            role="Career Editor",
        )
        blog_post = BlogPost.objects.create(
            title="How to write strong work experience in your resume",
            slug="how-to-write-strong-work-experience",
            category=blog_category,
            author=blog_author,
            is_published=True,
            published_at=date(2026, 1, 27),
            read_minutes=3,
        )
        BlogPostBlock.objects.create(
            post=blog_post,
            kind=BlogPostBlock.Kind.TEXT,
            title="Why work experience matters",
            anchor_id="why-work-experience-matters",
            html="<p>Paragraph 1</p><p>Paragraph 2</p>",
            paragraphs=["Paragraph 1", "Paragraph 2"],
            order=10,
        )

        change_url = reverse("admin:main_blogpost_change", args=[blog_post.pk])
        response = self.client.get(change_url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Why work experience matters")
        self.assertContains(response, "Blocks")

        english_response = self.client.get(f"{change_url}?lang=en")
        self.assertEqual(english_response.status_code, 200)
        self.assertNotContains(english_response, "title_de")
        self.assertContains(english_response, "WYSIWYG")
        self.assertNotContains(english_response, "Kind")
        self.assertNotContains(english_response, "Paragraphs")
        self.assertNotContains(english_response, "Items")
        self.assertNotContains(english_response, "Html [en]")
        self.assertNotContains(english_response, "Items [en]")
        self.assertContains(
            english_response,
            "&quot;name&quot;: &quot;anchor_id&quot;, &quot;dependency_ids&quot;: [&quot;#id_blocks-__prefix__-title_en&quot;]",
        )

        german_response = self.client.get(f"{change_url}?lang=de")
        self.assertEqual(german_response.status_code, 200)
        self.assertNotContains(german_response, "title_en")
        self.assertContains(
            german_response,
            "&quot;name&quot;: &quot;anchor_id&quot;, &quot;dependency_ids&quot;: [&quot;#id_blocks-__prefix__-title_de&quot;]",
        )


class MainApiTests(TestCase):
    def test_item_detail_api_includes_final_cta_block(self):
        category = Category.objects.create(name="Military", slug="military")
        product = Product.objects.create(
            name="Falcon X",
            slug="falcon-x",
            category=category,
            description="Long-range platform",
            available=True,
        )
        ProductFinalCTABlock.objects.create(
            product=product,
            title="Talk to our team about mission fit",
            paragraph="We can help you evaluate integration, deployment, and mission fit.",
            has_button=True,
        )

        response = self.client.get(reverse("main:item-detail", args=[product.slug]))

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(
            payload["final_cta_block"],
            {
                "id": product.final_cta_block.id,
                "title": "Talk to our team about mission fit",
                "paragraph": "We can help you evaluate integration, deployment, and mission fit.",
                "has_button": True,
            },
        )

    def test_blog_post_detail_api_returns_published_post_with_blocks(self):
        category = BlogCategory.objects.create(name="Resume Tips", slug="resume-tips")
        author = BlogAuthor.objects.create(name="Andrew Scott", role="Career Editor")
        post = BlogPost.objects.create(
            title="How to write strong work experience in your resume",
            slug="how-to-write-strong-work-experience",
            subtitle="A clean structure for describing impact and growth.",
            category=category,
            author=author,
            is_published=True,
            published_at=date(2026, 1, 27),
            read_minutes=3,
        )
        BlogPostBlock.objects.create(
            post=post,
            kind=BlogPostBlock.Kind.TEXT,
            title="Why work experience matters",
            anchor_id="why-work-experience-matters",
            html="<p>First paragraph</p><p>Second paragraph</p>",
            paragraphs=["First paragraph", "Second paragraph"],
            order=10,
        )
        BlogPostBlock.objects.create(
            post=post,
            kind=BlogPostBlock.Kind.BULLETS,
            title="Tips to strengthen",
            anchor_id="tips-to-strengthen",
            items=["Focus on achievements", "Quantify results"],
            order=20,
        )

        response = self.client.get(
            reverse("main:blog-post-detail", args=[post.slug])
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json(),
            {
                "id": post.id,
                "slug": post.slug,
                "category": "Resume Tips",
                "category_slug": "resume-tips",
                "title": post.title,
                "hero_image": None,
                "subtitle": post.subtitle,
                "author": "Andrew Scott",
                "author_role": "Career Editor",
                "published_at": "2026-01-27",
                "read_minutes": 3,
                "read_time": "3 mins read",
                "blocks": [
                    {
                        "id": "why-work-experience-matters",
                        "type": "text",
                        "title": "Why work experience matters",
                        "html": "<p>First paragraph</p><p>Second paragraph</p>",
                        "paragraphs": ["First paragraph", "Second paragraph"],
                        "items": [],
                        "image": None,
                        "image_alt": "",
                        "order": 10,
                    },
                    {
                        "id": "tips-to-strengthen",
                        "type": "bullets",
                        "title": "Tips to strengthen",
                        "html": "",
                        "paragraphs": [],
                        "items": [
                            "Focus on achievements",
                            "Quantify results",
                        ],
                        "image": None,
                        "image_alt": "",
                        "order": 20,
                    },
                ],
                "sections": [
                    {
                        "id": "why-work-experience-matters",
                        "title": "Why work experience matters",
                        "paragraphs": ["First paragraph", "Second paragraph"],
                        "bullets": [],
                        "order": 10,
                    },
                    {
                        "id": "tips-to-strengthen",
                        "title": "Tips to strengthen",
                        "paragraphs": [],
                        "bullets": [
                            "Focus on achievements",
                            "Quantify results",
                        ],
                        "order": 20,
                    },
                ],
            },
        )

    def test_blog_post_detail_api_falls_back_to_legacy_sections_when_blocks_missing(self):
        category = BlogCategory.objects.create(name="Resume Tips", slug="resume-tips")
        author = BlogAuthor.objects.create(name="Andrew Scott", role="Career Editor")
        post = BlogPost.objects.create(
            title="Legacy structure",
            slug="legacy-structure",
            subtitle="Legacy subtitle",
            category=category,
            author=author,
            is_published=True,
            published_at=date(2026, 2, 1),
            read_minutes=4,
        )
        BlogPostSection.objects.create(
            post=post,
            title="Legacy section",
            anchor_id="legacy-section",
            paragraphs=["Legacy paragraph"],
            order=10,
        )

        response = self.client.get(
            reverse("main:blog-post-detail", args=[post.slug])
        )
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(
            payload["blocks"],
            [
                {
                    "id": "legacy-section",
                    "type": "text",
                    "title": "Legacy section",
                    "html": "",
                    "paragraphs": ["Legacy paragraph"],
                    "items": [],
                    "image": None,
                    "image_alt": "",
                    "order": 10,
                }
            ],
        )
        self.assertEqual(
            payload["sections"],
            [
                {
                    "id": "legacy-section",
                    "title": "Legacy section",
                    "paragraphs": ["Legacy paragraph"],
                    "bullets": [],
                    "order": 10,
                }
            ],
        )

    def test_blog_post_detail_api_allows_missing_author(self):
        category = BlogCategory.objects.create(name="Resume Tips", slug="resume-tips")
        post = BlogPost.objects.create(
            title="Anonymous post",
            slug="anonymous-post",
            subtitle="No author assigned.",
            category=category,
            author=None,
            is_published=True,
            published_at=date(2026, 2, 3),
            read_minutes=4,
        )

        response = self.client.get(
            reverse("main:blog-post-detail", args=[post.slug])
        )
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload["author"], "")
        self.assertEqual(payload["author_role"], "")

    def test_blog_post_list_api_returns_published_posts_sorted(self):
        category = BlogCategory.objects.create(name="Resume Tips", slug="resume-tips")
        author = BlogAuthor.objects.create(name="Andrew Scott", role="Career Editor")
        first = BlogPost.objects.create(
            title="Published first",
            slug="published-first",
            subtitle="First subtitle",
            category=category,
            author=author,
            is_published=True,
            published_at=date(2026, 1, 27),
            read_minutes=3,
            order=10,
        )
        second = BlogPost.objects.create(
            title="Published second",
            slug="published-second",
            subtitle="Second subtitle",
            category=category,
            author=author,
            is_published=True,
            published_at=date(2026, 1, 20),
            read_minutes=5,
            order=20,
        )
        BlogPost.objects.create(
            title="Draft",
            slug="draft",
            is_published=False,
            order=5,
        )

        response = self.client.get(reverse("main:blog-post-list"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json(),
            [
                {
                    "id": first.id,
                    "slug": "published-first",
                    "category": "Resume Tips",
                    "category_slug": "resume-tips",
                    "title": "Published first",
                    "hero_image": None,
                    "subtitle": "First subtitle",
                    "author": "Andrew Scott",
                    "author_role": "Career Editor",
                    "published_at": "2026-01-27",
                    "read_minutes": 3,
                    "read_time": "3 mins read",
                },
                {
                    "id": second.id,
                    "slug": "published-second",
                    "category": "Resume Tips",
                    "category_slug": "resume-tips",
                    "title": "Published second",
                    "hero_image": None,
                    "subtitle": "Second subtitle",
                    "author": "Andrew Scott",
                    "author_role": "Career Editor",
                    "published_at": "2026-01-20",
                    "read_minutes": 5,
                    "read_time": "5 mins read",
                },
            ],
        )

    def test_blog_post_detail_api_returns_404_for_unpublished_post(self):
        post = BlogPost.objects.create(
            title="Draft post",
            slug="draft-post",
            is_published=False,
        )

        response = self.client.get(
            reverse("main:blog-post-detail", args=[post.slug])
        )
        self.assertEqual(response.status_code, 404)

    @override_settings(
        EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
        DEFAULT_FROM_EMAIL="noreply@ai-def.test",
        CONTACT_REQUEST_NOTIFICATION_EMAILS=["sales@ai-def.test"],
    )
    def test_contact_request_api_sends_email_notification(self):
        payload = {
            "firstName": "Alex",
            "lastName": "Stone",
            "email": "alex@example.com",
            "phone": "+421900000000",
            "product": "ax2ng-krakatit",
            "country": "SK",
            "countryName": "Slovakia",
            "city": "Bratislava",
            "addressLine1": "Ilkovicova 8",
            "addressLine2": "Office 401",
            "website": "https://example.com",
            "message": "Need a quote.",
            "variant": "default",
            "language": "en",
            "source": "/en/support",
        }

        response = self.client.post(
            reverse("main:contact-request"),
            data=json.dumps(payload),
            content_type="application/json",
            HTTP_USER_AGENT="pytest-agent",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(ContactRequest.objects.count(), 1)
        self.assertEqual(len(mail.outbox), 1)

        message = mail.outbox[0]
        self.assertEqual(
            message.subject,
            "New contact — Alex Stone (ax2ng-krakatit)",
        )
        self.assertEqual(message.to, ["sales@ai-def.test"])
        self.assertEqual(message.reply_to, ["alex@example.com"])
        self.assertIn("Main contact information", message.body)
        self.assertIn("Request details", message.body)
        self.assertIn("Need a quote.", message.body)
        self.assertNotIn("Address line 3:", message.body)
        self.assertIn(
            "View in admin: http://testserver/admin/main/contactrequest/1/change/",
            message.body,
        )
        self.assertEqual(len(message.alternatives), 1)
        self.assertEqual(message.alternatives[0].mimetype, "text/html")
        self.assertIn(
            'href="mailto:alex@example.com"',
            message.alternatives[0].content,
        )

    @override_settings(
        DEBUG=True,
        DEFAULT_FROM_EMAIL="noreply@ai-def.test",
        CONTACT_REQUEST_NOTIFICATION_EMAILS=["sales@ai-def.test"],
    )
    @patch(
        "main.api.EmailMultiAlternatives.send",
        side_effect=RuntimeError("SMTP unavailable"),
    )
    def test_contact_request_api_returns_502_when_email_notification_fails(
        self, mocked_send_mail
    ):
        payload = {
            "firstName": "Alex",
            "lastName": "Stone",
            "email": "alex@example.com",
            "phone": "+421900000000",
            "product": "ax2ng-krakatit",
            "country": "SK",
            "countryName": "Slovakia",
            "city": "Bratislava",
            "addressLine1": "Ilkovicova 8",
            "addressLine2": "Office 401",
            "website": "https://example.com",
            "message": "Need a quote.",
            "variant": "default",
            "language": "en",
            "source": "/en/support",
        }

        response = self.client.post(
            reverse("main:contact-request"),
            data=json.dumps(payload),
            content_type="application/json",
            HTTP_USER_AGENT="pytest-agent",
        )

        self.assertEqual(response.status_code, 502)
        self.assertEqual(
            response.json()["detail"],
            "Unable to send contact request email notification. Email error: SMTP unavailable",
        )
        self.assertEqual(ContactRequest.objects.count(), 0)
        mocked_send_mail.assert_called_once()

    @override_settings(
        DEBUG=False,
        DEFAULT_FROM_EMAIL="noreply@ai-def.test",
        CONTACT_REQUEST_NOTIFICATION_EMAILS=["sales@ai-def.test"],
    )
    @patch(
        "main.api.EmailMultiAlternatives.send",
        side_effect=RuntimeError("SMTP unavailable"),
    )
    def test_contact_request_api_hides_email_notification_error_outside_debug(
        self, mocked_send_mail
    ):
        payload = {
            "firstName": "Alex",
            "lastName": "Stone",
            "email": "alex@example.com",
            "phone": "+421900000000",
            "product": "ax2ng-krakatit",
            "country": "SK",
            "countryName": "Slovakia",
            "city": "Bratislava",
            "addressLine1": "Ilkovicova 8",
            "addressLine2": "Office 401",
            "website": "https://example.com",
            "message": "Need a quote.",
            "variant": "default",
            "language": "en",
            "source": "/en/support",
        }

        response = self.client.post(
            reverse("main:contact-request"),
            data=json.dumps(payload),
            content_type="application/json",
            HTTP_USER_AGENT="pytest-agent",
        )

        self.assertEqual(response.status_code, 502)
        self.assertEqual(
            response.json()["detail"],
            "Unable to send contact request email notification.",
        )
        self.assertEqual(ContactRequest.objects.count(), 0)
        mocked_send_mail.assert_called_once()
