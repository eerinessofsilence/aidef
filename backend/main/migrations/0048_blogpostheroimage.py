from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0047_remove_productfinalctablock_background_image"),
    ]

    operations = [
        migrations.CreateModel(
            name="BlogPostHeroImage",
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
                ("image", models.ImageField(upload_to="blog/%Y/%m/")),
                ("alt", models.CharField(blank=True, max_length=255)),
                ("order", models.PositiveSmallIntegerField(default=0)),
                (
                    "post",
                    models.ForeignKey(
                        on_delete=models.deletion.CASCADE,
                        related_name="hero_images",
                        to="main.blogpost",
                    ),
                ),
            ],
            options={
                "verbose_name": "Blog post hero image",
                "verbose_name_plural": "Blog post hero images",
                "ordering": ("order", "pk"),
            },
        ),
    ]
