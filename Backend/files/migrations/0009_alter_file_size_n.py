# Generated by Django 5.0.7 on 2024-07-12 18:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('files', '0008_rename_namefile_file_original_name_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='file',
            name='size_n',
            field=models.BigIntegerField(blank=True, null=True),
        ),
    ]
