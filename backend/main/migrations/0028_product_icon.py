from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("main", "0027_contactrequest"),
    ]

    operations = [
        migrations.AddField(
            model_name="product",
            name="icon",
            field=models.ImageField(
                blank=True,
                null=True,
                upload_to="product_icons/%Y/%m/",
            ),
        ),
    ]
