from datetime import date
import shutil
import tempfile

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from django.urls import reverse

from .models import (
    BlogAuthor,
    BlogCategory,
    BlogPost,
    BlogPostSection,
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

    def test_blog_post_admin_change_form_renders_sections_inline(self):
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
        BlogPostSection.objects.create(
            post=blog_post,
            title="Why work experience matters",
            anchor_id="why-work-experience-matters",
            paragraphs=["Paragraph 1", "Paragraph 2"],
            order=10,
        )

        change_url = reverse("admin:main_blogpost_change", args=[blog_post.pk])
        response = self.client.get(change_url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Why work experience matters")
        self.assertContains(response, "Sections")


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

    def test_blog_post_detail_api_returns_published_post_with_sections(self):
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
        BlogPostSection.objects.create(
            post=post,
            title="Why work experience matters",
            anchor_id="why-work-experience-matters",
            paragraphs=["First paragraph", "Second paragraph"],
            order=10,
        )
        BlogPostSection.objects.create(
            post=post,
            title="Tips to strengthen",
            anchor_id="tips-to-strengthen",
            bullets=["Focus on achievements", "Quantify results"],
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
