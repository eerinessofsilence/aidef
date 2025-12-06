from django.db import models
from django.utils.text import slugify
from decimal import Decimal


class Category(models.Model):
    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=140, unique=True, blank=True)

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    description = models.TextField(blank=True)
    available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    specs = models.JSONField(blank=True, null=True)

    is_featured = models.BooleanField(
        default=False,
        help_text="Show this product as the flagship / favorite item.",
    )

    class Meta:
        verbose_name = "Product"
        verbose_name_plural = "Products"
        ordering = ('-is_featured', '-created_at',)

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.name)[:230]
            slug = base
            counter = 1
            while Product.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

        if self.is_featured:
            Product.objects.exclude(pk=self.pk).filter(is_featured=True).update(is_featured=False)

    def __str__(self):
        return self.name


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/%Y/%m/')
    alt = models.CharField(max_length=255, blank=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ('order',)
        verbose_name = "Product image"
        verbose_name_plural = "Product images"

    def __str__(self):
        return f"{self.product.name} — image {self.pk}"
    

class ProductFeature(models.Model):
    product = models.ForeignKey(
        Product,
        related_name="features",
        on_delete=models.CASCADE,
    )
    name = models.CharField(max_length=100)
    value = models.CharField(max_length=100)
    description = models.TextField(max_length=256, default="")
    order = models.PositiveIntegerField(default=0)