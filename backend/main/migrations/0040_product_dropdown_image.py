from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0039_blogauthor_name_de_blogauthor_name_en_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="product",
            name="dropdown_image",
            field=models.ImageField(
                blank=True,
                help_text="Image shown on Product cards in the header dropdown.",
                null=True,
                upload_to="product_dropdown_images/%Y/%m/",
            ),
        ),
    ]
