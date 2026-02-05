from django.db import migrations, models
import main.models


class Migration(migrations.Migration):
    dependencies = [
        ("main", "0028_product_icon"),
    ]

    operations = [
        migrations.AlterField(
            model_name="product",
            name="icon",
            field=models.FileField(
                blank=True,
                null=True,
                upload_to="product_icons/%Y/%m/",
                validators=[main.models.validate_svg_file],
            ),
        ),
    ]
