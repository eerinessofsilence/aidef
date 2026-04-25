import django.core.validators
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0050_civilproduct_dropdown_image"),
    ]

    operations = [
        migrations.CreateModel(
            name="CivilProductDroneSliderMedia",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "image",
                    models.ImageField(
                        blank=True,
                        upload_to="civil_products/drone_slider/%Y/%m/",
                    ),
                ),
                (
                    "video",
                    models.FileField(
                        blank=True,
                        help_text="Optional preview video played on card hover.",
                        upload_to="civil_products/drone_slider/%Y/%m/",
                        validators=[
                            django.core.validators.FileExtensionValidator(
                                allowed_extensions=["mp4", "webm", "mov", "m4v"]
                            )
                        ],
                    ),
                ),
                (
                    "product",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="drone_slider_media",
                        to="main.civilproduct",
                    ),
                ),
            ],
            options={
                "verbose_name": "Civil product DroneSlider media",
                "verbose_name_plural": "Civil product DroneSlider media",
            },
        ),
    ]
