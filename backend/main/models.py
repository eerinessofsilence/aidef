from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator
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


_ICON_EXTENSIONS = ["svg", "svgz", "png", "jpg", "jpeg", "webp", "gif"]
_icon_extension_validator = FileExtensionValidator(
    allowed_extensions=_ICON_EXTENSIONS
)
_DRONE_SLIDER_VIDEO_EXTENSIONS = ["mp4", "webm", "mov", "m4v"]
_drone_slider_video_extension_validator = FileExtensionValidator(
    allowed_extensions=_DRONE_SLIDER_VIDEO_EXTENSIONS
)


def validate_svg_file(value):
    if not value:
        return
    _icon_extension_validator(value)
    name = getattr(value, "name", "")
    if not isinstance(name, str) or not name.lower().endswith(".svg"):
        return
    file_obj = getattr(value, "file", value)
    try:
        position = file_obj.tell() if hasattr(file_obj, "tell") else None
        chunk = file_obj.read(1024)
        if hasattr(file_obj, "seek") and position is not None:
            file_obj.seek(position)
    except Exception:
        return
    if isinstance(chunk, bytes):
        snippet = chunk.decode("utf-8", errors="ignore").lower()
    else:
        snippet = str(chunk).lower()
    if "<svg" not in snippet:
        raise ValidationError("Загрузи валидный SVG файл.")

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
    icon = models.FileField(
        upload_to='product_icons/%Y/%m/',
        blank=True,
        null=True,
        validators=[validate_svg_file],
    )
    available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    specs = models.JSONField(blank=True, null=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        verbose_name = "Product"
        verbose_name_plural = "Products"
        ordering = ('order', '-created_at',)

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

    def __str__(self):
        return self.name


class ProductDroneSliderMedia(models.Model):
    product = models.OneToOneField(
        Product,
        on_delete=models.CASCADE,
        related_name="drone_slider_media",
    )
    image = models.ImageField(upload_to="products/drone_slider/%Y/%m/", blank=True)
    video = models.FileField(
        upload_to="products/drone_slider/%Y/%m/",
        blank=True,
        validators=[_drone_slider_video_extension_validator],
        help_text="Optional preview video played on card hover.",
    )

    class Meta:
        verbose_name = "Product DroneSlider media"
        verbose_name_plural = "Product DroneSlider media"

    def __str__(self):
        return f"{self.product.name} — DroneSlider media"


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/%Y/%m/')
    alt = models.CharField(max_length=255, blank=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ('order',)
        verbose_name = "Product image"
        verbose_name_plural = "Product images"

    def save(self, *args, **kwargs):
        creating = self.pk is None
        super().save(*args, **kwargs)
        if creating:
            self.ensure_translations()

    def ensure_translations(self, english_alt=None):
        if english_alt is None:
            english_alt = (
                ProductImageTranslation.objects.filter(
                    image=self, lang="en"
                )
                .values_list("alt", flat=True)
                .first()
                or self.alt
                or ""
            )
        if isinstance(english_alt, str):
            english_alt = english_alt.strip()
        for lang, _ in ProductImageTranslation.Lang.choices:
            if lang == "en":
                alt = english_alt
            else:
                alt = english_alt if english_alt else ""
            ProductImageTranslation.objects.get_or_create(
                image=self,
                lang=lang,
                defaults={"alt": alt},
            )

    def __str__(self):
        return f"{self.product.name} — image {self.pk}"
    

class ProductImageTranslation(models.Model):
    class Lang(models.TextChoices):
        EN = "en", "English"
        DE = "de", "German"
        SK = "sk", "Slovak"
        ES = "es", "Spanish"
        FR = "fr", "French"
        IT = "it", "Italian"

    image = models.ForeignKey(
        ProductImage, on_delete=models.CASCADE, related_name="translations"
    )
    lang = models.CharField(max_length=2, choices=Lang.choices)
    alt = models.CharField(max_length=255)

    class Meta:
        unique_together = ("image", "lang")
        verbose_name = "Product image translation"
        verbose_name_plural = "Product image translations"

    def __str__(self):
        return f"{self.image_id} ({self.lang})"


class ProductFeature(models.Model):
    product = models.ForeignKey(
        Product,
        related_name="features",
        on_delete=models.CASCADE,
    )
    name = models.CharField(max_length=100)
    value = models.CharField(max_length=100)
    description = models.TextField(max_length=512, blank=True)
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
    description = models.TextField(max_length=512, blank=True)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ('order',)
        verbose_name = "Product sub feature"
        verbose_name_plural = "Product sub features"
        
    def __str__(self):
        return f"{self.product.name} — sub feature {self.pk}"
    
class ProductGallery(models.Model):
    product = models.ForeignKey(
        Product,
        related_name="gallery",
        on_delete=models.CASCADE,
    )
    
    image = models.ImageField(upload_to='products/%Y/%m/', blank=False)
    alt = models.CharField(max_length=255, blank=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ('order',)
        verbose_name = "Product gallery image"
        verbose_name_plural = "Product gallery images"

    def __str__(self):
        return f"{self.product.name} — gallery {self.pk}"
    
class ProductTechnology(models.Model):
    product = models.ForeignKey(
        Product,
        related_name="technologies",
        on_delete=models.CASCADE,
    )
    name = models.CharField(max_length=100)
    description = models.TextField(max_length=512, blank=True)
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
    
class ProductFeatureBlock(models.Model):
    product = models.ForeignKey(
        Product,
        related_name="feature_blocks",
        on_delete=models.CASCADE,
    )
    name = models.CharField(max_length=100)
    title = models.CharField(max_length=100)
    description = models.TextField(max_length=512, blank=True)
    background_image = models.ImageField(upload_to='products/%Y/%m/', blank=True)
    with_logo = models.BooleanField(blank=False)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ('order',)
        verbose_name = "Product feature block"
        verbose_name_plural = "Product feature blocks"
        
    def __str__(self):
        return f"{self.product.name} — feature block {self.pk}"
    
class ProductInfoBlock(models.Model):
    product = models.ForeignKey(
        Product,
        related_name="info_blocks",
        on_delete=models.CASCADE,
    )
    title_1 = models.CharField(max_length=128)
    description_1 = models.JSONField(max_length=1024, blank=True, null=True)
    image_1 = models.ImageField(upload_to='products/%Y/%m/', blank=True)
    title_2 = models.CharField(max_length=128)
    description_2 = models.JSONField(max_length=1024, blank=True, null=True)
    image_2 = models.ImageField(upload_to='products/%Y/%m/', blank=True)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ('order',)
        verbose_name = "Product info block"
        verbose_name_plural = "Product info blocks"
        
    def __str__(self):
        return f"{self.product.name} — info block {self.pk}"

class ProductCTABlock(models.Model):
    product = models.ForeignKey(
        Product,
        related_name="cta_blocks",
        on_delete=models.CASCADE,
    )
    name = models.CharField(max_length=100)
    title = models.CharField(max_length=128, blank=False)
    background_image = models.ImageField(upload_to='products/%Y/%m/', blank=True)
    has_button = models.BooleanField(blank=True)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ('order',)
        verbose_name = "Product CTA block"
        verbose_name_plural = "Product CTA blocks"
        
    def __str__(self):
        return f"{self.product.name} — CTA block {self.pk}"


class CivilCategory(models.Model):
    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=140, unique=True, blank=True)

    class Meta:
        verbose_name = "Civil category"
        verbose_name_plural = "Civil categories"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class CivilProduct(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    category = models.ForeignKey(
        CivilCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    description = models.TextField(blank=True)
    icon = models.FileField(
        upload_to='civil_product_icons/%Y/%m/',
        blank=True,
        null=True,
        validators=[validate_svg_file],
    )
    available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    specs = models.JSONField(blank=True, null=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        verbose_name = "Civil product"
        verbose_name_plural = "Civil products"
        ordering = ('order', '-created_at',)

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.name)[:230]
            slug = base
            counter = 1
            while CivilProduct.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class CivilProductImage(models.Model):
    product = models.ForeignKey(
        CivilProduct,
        on_delete=models.CASCADE,
        related_name='images',
    )
    image = models.ImageField(upload_to='civil_products/%Y/%m/')
    alt = models.CharField(max_length=255, blank=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ('order',)
        verbose_name = "Civil product image"
        verbose_name_plural = "Civil product images"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.ensure_translations(english_alt=self.alt or "")

    def ensure_translations(self, english_alt=None):
        if english_alt is None:
            english_alt = (
                CivilProductImageTranslation.objects.filter(
                    image=self, lang='en'
                )
                .values_list('alt', flat=True)
                .first()
                or self.alt
                or ''
            )
        if isinstance(english_alt, str):
            english_alt = english_alt.strip()
        for lang, _ in CivilProductImageTranslation.Lang.choices:
            alt = english_alt if lang == 'en' else (english_alt if english_alt else '')
            CivilProductImageTranslation.objects.get_or_create(
                image=self,
                lang=lang,
                defaults={'alt': alt},
            )

    def __str__(self):
        return f"{self.product.name} — image {self.pk}"


class CivilProductImageTranslation(models.Model):
    class Lang(models.TextChoices):
        EN = 'en', 'English'
        DE = 'de', 'German'
        SK = 'sk', 'Slovak'
        ES = 'es', 'Spanish'
        FR = 'fr', 'French'
        IT = 'it', 'Italian'

    image = models.ForeignKey(
        CivilProductImage,
        on_delete=models.CASCADE,
        related_name='translations',
    )
    lang = models.CharField(max_length=2, choices=Lang.choices)
    alt = models.CharField(max_length=255)

    class Meta:
        unique_together = ('image', 'lang')
        verbose_name = "Civil product image translation"
        verbose_name_plural = "Civil product image translations"

    def __str__(self):
        return f"{self.image_id} ({self.lang})"


class CivilProductFeature(models.Model):
    product = models.ForeignKey(
        CivilProduct,
        related_name='features',
        on_delete=models.CASCADE,
    )
    name = models.CharField(max_length=100)
    value = models.CharField(max_length=100)
    description = models.TextField(max_length=512, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ('order',)
        verbose_name = "Civil product feature"
        verbose_name_plural = "Civil product features"

    def __str__(self):
        return f"{self.product.name} — feature {self.pk}"


class CivilProductSubFeature(models.Model):
    product = models.ForeignKey(
        CivilProduct,
        related_name='sub_features',
        on_delete=models.CASCADE,
    )
    name = models.CharField(max_length=100)
    description = models.TextField(max_length=512, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ('order',)
        verbose_name = "Civil product sub feature"
        verbose_name_plural = "Civil product sub features"

    def __str__(self):
        return f"{self.product.name} — sub feature {self.pk}"


class CivilProductGallery(models.Model):
    product = models.ForeignKey(
        CivilProduct,
        related_name='gallery',
        on_delete=models.CASCADE,
    )
    image = models.ImageField(upload_to='civil_products/%Y/%m/', blank=False)
    alt = models.CharField(max_length=255, blank=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ('order',)
        verbose_name = "Civil product gallery image"
        verbose_name_plural = "Civil product gallery images"

    def __str__(self):
        return f"{self.product.name} — gallery {self.pk}"


class CivilProductTechnology(models.Model):
    product = models.ForeignKey(
        CivilProduct,
        related_name='technologies',
        on_delete=models.CASCADE,
    )
    name = models.CharField(max_length=100)
    description = models.TextField(max_length=512, blank=True)
    tags = models.JSONField(
        default=list,
        blank=True,
        help_text='List of up to 3 badges for this technology.',
        validators=[validate_tags_max_three],
    )
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ('order',)
        verbose_name = "Civil product technology"
        verbose_name_plural = "Civil product technologies"

    def __str__(self):
        return f"{self.product.name} — technology {self.pk}"


class CivilProductFeatureBlock(models.Model):
    product = models.ForeignKey(
        CivilProduct,
        related_name='feature_blocks',
        on_delete=models.CASCADE,
    )
    name = models.CharField(max_length=100)
    title = models.CharField(max_length=100)
    description = models.TextField(max_length=512, blank=True)
    background_image = models.ImageField(upload_to='civil_products/%Y/%m/', blank=True)
    with_logo = models.BooleanField(blank=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ('order',)
        verbose_name = "Civil product feature block"
        verbose_name_plural = "Civil product feature blocks"

    def __str__(self):
        return f"{self.product.name} — feature block {self.pk}"


class CivilProductInfoBlock(models.Model):
    product = models.ForeignKey(
        CivilProduct,
        related_name='info_blocks',
        on_delete=models.CASCADE,
    )
    title_1 = models.CharField(max_length=128)
    description_1 = models.JSONField(max_length=1024, blank=True, null=True)
    image_1 = models.ImageField(upload_to='civil_products/%Y/%m/', blank=True)
    title_2 = models.CharField(max_length=128)
    description_2 = models.JSONField(max_length=1024, blank=True, null=True)
    image_2 = models.ImageField(upload_to='civil_products/%Y/%m/', blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ('order',)
        verbose_name = "Civil product info block"
        verbose_name_plural = "Civil product info blocks"

    def __str__(self):
        return f"{self.product.name} — info block {self.pk}"


class CivilProductCTABlock(models.Model):
    product = models.ForeignKey(
        CivilProduct,
        related_name='cta_blocks',
        on_delete=models.CASCADE,
    )
    name = models.CharField(max_length=100)
    title = models.CharField(max_length=128, blank=False)
    background_image = models.ImageField(upload_to='civil_products/%Y/%m/', blank=True)
    has_button = models.BooleanField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ('order',)
        verbose_name = "Civil product CTA block"
        verbose_name_plural = "Civil product CTA blocks"

    def __str__(self):
        return f"{self.product.name} — CTA block {self.pk}"


class LinkedInPost(models.Model):
    embed_url = models.URLField(
        max_length=600,
        help_text=(
            "LinkedIn embed URL, for example: "
            "https://www.linkedin.com/embed/feed/update/urn:li:share:..."
        ),
    )
    is_active = models.BooleanField(default=True)
    order = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("order", "-created_at", "pk")
        verbose_name = "LinkedIn post"
        verbose_name_plural = "LinkedIn posts"

    def __str__(self):
        return f"LinkedIn post #{self.pk}"


class ContactRequest(models.Model):
    class Variant(models.TextChoices):
        DEFAULT = "default", "Default"
        SUPPORT = "support", "Support"

    class Status(models.TextChoices):
        NEW = "new", "New"
        IN_PROGRESS = "in_progress", "In progress"
        DONE = "done", "Done"
        SPAM = "spam", "Spam"

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.NEW,
        db_index=True,
    )
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_contact_requests",
    )
    internal_note = models.TextField(blank=True)
    variant = models.CharField(
        max_length=20, choices=Variant.choices, default=Variant.DEFAULT
    )
    first_name = models.CharField(max_length=120)
    last_name = models.CharField(max_length=120)
    email = models.EmailField()
    phone = models.CharField(max_length=60, blank=True)
    product = models.CharField(max_length=120, blank=True)
    country_code = models.CharField(max_length=2, blank=True)
    country_name = models.CharField(max_length=120, blank=True)
    address_line1 = models.CharField(max_length=255, blank=True)
    address_line2 = models.CharField(max_length=255, blank=True)
    address_line3 = models.CharField(max_length=255, blank=True)
    website = models.CharField(max_length=255, blank=True)
    message = models.TextField()
    source = models.CharField(max_length=255, blank=True)
    language = models.CharField(max_length=16, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)

    class Meta:
        ordering = ("-created_at",)
        verbose_name = "Contact request"
        verbose_name_plural = "Contact requests"

    def __str__(self):
        return f"{self.first_name} {self.last_name} — {self.email}"
