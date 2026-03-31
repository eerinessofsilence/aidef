from dataclasses import dataclass
from datetime import datetime

from django.conf import settings
from django.contrib.sitemaps import Sitemap

from main.models import BlogPost, CivilProduct, Product


SUPPORTED_LANGUAGES = tuple(language for language, _ in settings.LANGUAGES)

STATIC_ROUTES = (
    ("", "weekly", 1.0),
    ("solutions", "weekly", 0.9),
    ("technology", "monthly", 0.8),
    ("blog", "daily", 0.8),
    ("about-us", "monthly", 0.7),
    ("support", "monthly", 0.7),
    ("terms-of-condition", "yearly", 0.3),
)


def _build_localized_path(language: str, path: str) -> str:
    if not path:
        return f"/{language}"
    return f"/{language}/{path}"


@dataclass(frozen=True)
class StaticRouteItem:
    language: str
    path: str
    changefreq_value: str
    priority_value: float


@dataclass(frozen=True)
class DynamicRouteItem:
    language: str
    path: str
    updated_at: datetime


class LocalizedStaticSitemap(Sitemap):
    protocol = "https"

    def items(self):
        return [
            StaticRouteItem(language, path, changefreq, priority)
            for language in SUPPORTED_LANGUAGES
            for path, changefreq, priority in STATIC_ROUTES
        ]

    def location(self, item: StaticRouteItem) -> str:
        return _build_localized_path(item.language, item.path)

    def changefreq(self, item: StaticRouteItem) -> str:
        return item.changefreq_value

    def priority(self, item: StaticRouteItem) -> float:
        return item.priority_value


class ProductSitemap(Sitemap):
    protocol = "https"
    changefreq = "weekly"
    priority = 0.8

    def items(self):
        products = list(
            Product.objects.filter(available=True).only("slug", "updated_at")
        )
        return [
            DynamicRouteItem(
                language=language,
                path=f"products/{product.slug}",
                updated_at=product.updated_at,
            )
            for language in SUPPORTED_LANGUAGES
            for product in products
            if product.slug
        ]

    def location(self, item: DynamicRouteItem) -> str:
        return _build_localized_path(item.language, item.path)

    def lastmod(self, item: DynamicRouteItem) -> datetime:
        return item.updated_at


class CivilProductSitemap(Sitemap):
    protocol = "https"
    changefreq = "weekly"
    priority = 0.8

    def items(self):
        products = list(
            CivilProduct.objects.filter(available=True).only("slug", "updated_at")
        )
        return [
            DynamicRouteItem(
                language=language,
                path=f"civil-products/{product.slug}",
                updated_at=product.updated_at,
            )
            for language in SUPPORTED_LANGUAGES
            for product in products
            if product.slug
        ]

    def location(self, item: DynamicRouteItem) -> str:
        return _build_localized_path(item.language, item.path)

    def lastmod(self, item: DynamicRouteItem) -> datetime:
        return item.updated_at


class BlogPostSitemap(Sitemap):
    protocol = "https"
    changefreq = "weekly"
    priority = 0.7

    def items(self):
        posts = list(
            BlogPost.objects.filter(is_published=True).only("slug", "updated_at")
        )
        return [
            DynamicRouteItem(
                language=language,
                path=f"blog/{post.slug}",
                updated_at=post.updated_at,
            )
            for language in SUPPORTED_LANGUAGES
            for post in posts
            if post.slug
        ]

    def location(self, item: DynamicRouteItem) -> str:
        return _build_localized_path(item.language, item.path)

    def lastmod(self, item: DynamicRouteItem) -> datetime:
        return item.updated_at


sitemaps = {
    "static": LocalizedStaticSitemap,
    "products": ProductSitemap,
    "civil_products": CivilProductSitemap,
    "blog_posts": BlogPostSitemap,
}
