from django.core.exceptions import ValidationError
from django.db import models
from django.utils.text import slugify


def validate_tags_max_three(value):
    if value is None:
        return
    if not isinstance(value, (list, tuple)):
        raise ValidationError("Tags must be a list of strings.")
    if len(value) > 3:
        raise ValidationError("No more than 3 tags are allowed.")
    for tag in value:
        if not isinstance(tag, str):
            raise ValidationError("Each tag must be a string.")
        if len(tag) > 40:
            raise ValidationError("Tag length must be 40 characters or less.")

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
    description = models.TextField(max_length=256, blank=False)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ('order',)
        verbose_name = "Product feature"
        verbose_name_plural = "Product features"
        
    def __str__(self):
        return f"{self.product.name} — feature {self.pk}"
    
class ProductSubFeature(models.Model):
    product = models.ForeignKey(
        Product,
        related_name="sub_features",
        on_delete=models.CASCADE,
    )
    name = models.CharField(max_length=100)
    description = models.TextField(max_length=256, blank=False)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ('order',)
        verbose_name = "Product sub feature"
        verbose_name_plural = "Product sub features"
        
    def __str__(self):
        return f"{self.product.name} — sub feature {self.pk}"
    
class ProductTechnology(models.Model):
    product = models.ForeignKey(
        Product,
        related_name="technologies",
        on_delete=models.CASCADE,
    )
    name = models.CharField(max_length=100)
    description = models.TextField(max_length=256, blank=False)
    tags = models.JSONField(
        default=list,
        blank=True,
        help_text="List of up to 3 badges for this technology.",
        validators=[validate_tags_max_three],
    )
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ('order',)
        verbose_name = "Product technology"
        verbose_name_plural = "Product technology"
        
    def __str__(self):
        return f"{self.product.name} — technology {self.pk}"
    
class ProductHeroFeatureBlock(models.Model):
    product = models.ForeignKey(
        Product,
        related_name="hero_feature_blocks",
        on_delete=models.CASCADE,
    )
    name = models.CharField(max_length=100)
    title = models.CharField(max_length=100)
    description = models.TextField(max_length=256, blank=False)
    background_image = models.ImageField(upload_to='products/%Y/%m/', blank=True)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ('order',)
        verbose_name = "Product hero feature block"
        verbose_name_plural = "Product hero feature blocks"
        
    def __str__(self):
        return f"{self.product.name} — hero feature block {self.pk}"
