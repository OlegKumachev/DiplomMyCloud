# Generated by Django 5.0.7 on 2024-08-03 13:36

import django.db.models.deletion
import files.models
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='File',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('original_name', models.CharField(blank=True, max_length=100)),
                ('unique_name', models.CharField(default=uuid.uuid4, max_length=100, unique=True)),
                ('file', models.FileField(blank=True, upload_to=files.models.user_directory_path)),
                ('size_n', models.BigIntegerField(blank=True, null=True)),
                ('special_url', models.URLField(blank=True)),
                ('comment', models.TextField(blank=True)),
                ('data_created', models.DateTimeField(auto_now_add=True)),
                ('last_date_download', models.DateTimeField(auto_now=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
