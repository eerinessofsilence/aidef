from django.db import models
from django.utils.text import slugify


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
    PRODUCT_TYPES = (
        ('drone', 'Drone'),
        ('weapon', 'Weapon'),
        ('accessory', 'Accessory'),
        ('part', 'Part'),
        ('other', 'Other'),
    )

    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    product_type = models.CharField(max_length=20, choices=PRODUCT_TYPES, default='other')
    sku = models.CharField(max_length=100, blank=True, null=True, help_text="Артикул")
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=5, decimal_places=2, default=0.0, help_text="В процентах")
    available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    specs = models.JSONField(blank=True, null=True)

    class Meta:
        verbose_name = "Product"
        verbose_name_plural = "Products"
        ordering = ('-created_at',)

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

    def price_after_discount(self):
        return float(self.price) * (1 - float(self.discount) / 100)

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

class FuelOption(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='fuel_options')
    name = models.CharField(max_length=140, help_text="Например: 'Battery 4500mAh' или 'Jet Fuel 5L'")
    extra_price = models.DecimalField(max_digits=8, decimal_places=2, default=0.0)
    capacity = models.CharField(max_length=80, blank=True, help_text="Объём/ёмкость (mAh, L и т.п.)")
    notes = models.TextField(blank=True)

    class Meta:
        verbose_name = "Fuel option/battery"
        verbose_name_plural = "Fuel options/batteries"

    def __str__(self):
        return f"{self.product.name} — {self.name}"
    
class MagazineOption(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='magazine_options')
    name = models.CharField(max_length=140)
    capacity = models.PositiveIntegerField(null=True, blank=True)
    caliber = models.CharField(max_length=60, blank=True)
    extra_price = models.DecimalField(max_digits=8, decimal_places=2, default=0.0)
    notes = models.TextField(blank=True)

    class Meta:
        verbose_name = "Magazine Option"
        verbose_name_plural = "Magazine Options"

    def __str__(self):
        return f"{self.product.name} — {self.name}"


class Accessory(models.Model):
    name = models.CharField(max_length=200)
    sku = models.CharField(max_length=100, blank=True, null=True)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Accessory"
        verbose_name_plural = "Accessories"

    def __str__(self):
        return self.name


class ProductAccessory(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_accessories')
    accessory = models.ForeignKey(Accessory, on_delete=models.CASCADE, related_name='attached_to_products')
    quantity = models.PositiveIntegerField(default=1)
    extra_price = models.DecimalField(max_digits=8, decimal_places=2, default=0.0, help_text="Доплата за аксессуар (если есть)")

    class Meta:
        verbose_name = "Product accessory"
        verbose_name_plural = "Product accessories"
        unique_together = ('product', 'accessory')

    def __str__(self):
        return f"{self.product.name} + {self.accessory.name}"
