# Generated by Django 5.0.7 on 2024-07-10 19:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('files', '0004_file_namefile'),
    ]

    operations = [
        migrations.AlterField(
            model_name='file',
            name='comment',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='file',
            name='file',
            field=models.FileField(blank=True, null=True, upload_to='uploads/'),
        ),
    ]
