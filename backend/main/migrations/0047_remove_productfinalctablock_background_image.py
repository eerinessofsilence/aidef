from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0046_productfinalctablock_paragraph"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="productfinalctablock",
            name="background_image",
        ),
    ]
