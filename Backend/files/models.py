import os
from uuid import uuid4
from django.db import models

from users.models import MyUser

def user_directory_path(instance, filename):
    user_name = instance.user.username
    return f'user_{user_name}/{filename}'

class File(models.Model):
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE)
    original_name = models.CharField(max_length=100, blank=True)
    unique_name = models.CharField(unique=True, max_length=100, default=uuid4)
    file = models.FileField(blank=True, upload_to=user_directory_path)
    size_n = models.BigIntegerField(blank=True, null=True)
    urlpath = models.URLField(blank=True)
    special_url = models.URLField(blank=True)
    comment = models.TextField(blank=True)
    data_created = models.DateTimeField(auto_now_add=True)
    last_date_download = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.original_name

    def save(self, *args, **kwargs):

        file_extension = os.path.splitext(self.file.name)[1]
        
        if not self.original_name:
            self.original_name = os.path.basename(self.file.name)
        else:
            if not self.original_name.endswith(file_extension):
                self.original_name += file_extension

        super().save(*args, **kwargs)