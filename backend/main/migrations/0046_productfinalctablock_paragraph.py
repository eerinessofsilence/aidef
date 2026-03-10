from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0045_productfinalctablock"),
    ]

    operations = [
        migrations.RenameField(
            model_name="productfinalctablock",
            old_name="name",
            new_name="paragraph",
        ),
        migrations.RenameField(
            model_name="productfinalctablock",
            old_name="name_en",
            new_name="paragraph_en",
        ),
        migrations.RenameField(
            model_name="productfinalctablock",
            old_name="name_de",
            new_name="paragraph_de",
        ),
        migrations.RenameField(
            model_name="productfinalctablock",
            old_name="name_sk",
            new_name="paragraph_sk",
        ),
        migrations.RenameField(
            model_name="productfinalctablock",
            old_name="name_es",
            new_name="paragraph_es",
        ),
        migrations.RenameField(
            model_name="productfinalctablock",
            old_name="name_fr",
            new_name="paragraph_fr",
        ),
        migrations.RenameField(
            model_name="productfinalctablock",
            old_name="name_it",
            new_name="paragraph_it",
        ),
        migrations.AlterField(
            model_name="productfinalctablock",
            name="paragraph",
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name="productfinalctablock",
            name="paragraph_en",
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="productfinalctablock",
            name="paragraph_de",
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="productfinalctablock",
            name="paragraph_sk",
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="productfinalctablock",
            name="paragraph_es",
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="productfinalctablock",
            name="paragraph_fr",
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="productfinalctablock",
            name="paragraph_it",
            field=models.TextField(blank=True, null=True),
        ),
    ]
