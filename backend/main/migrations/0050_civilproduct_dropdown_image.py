from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0049_civilproductfeature_icon_file_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="civilproduct",
            name="dropdown_image",
            field=models.ImageField(
                blank=True,
                help_text="Image shown on Civil product cards in the header dropdown.",
                null=True,
                upload_to="civil_product_dropdown_images/%Y/%m/",
            ),
        ),
    ]
