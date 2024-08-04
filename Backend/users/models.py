import os
from django.contrib.auth.models import AbstractUser
from django.db import models
from Backend import settings
from .manager import CustomUserManager
 

class MyUser(AbstractUser):
    username = models.CharField(max_length=100, unique=True, verbose_name='Login')
    is_superuser = models.BooleanField(default=False, verbose_name='admin')
    storage_path = models.URLField(blank=True)
    folder_name = models.CharField(max_length=255, blank=True)
    objects = CustomUserManager()
    total_size = models.BigIntegerField(default=0)
    
   

    def save(self, *args, **kwargs):
        created = not self.pk
        super().save(*args, **kwargs)
        if created:
            user_directory = os.path.join('user_{0}'.format(self.username))
            full_user_directory = os.path.join(settings.MEDIA_ROOT, user_directory)
            os.makedirs(full_user_directory, exist_ok=True)
            self.storage_path = user_directory

    def update_total_size(self):
        """ Обновляет размер хранилища пользователя """
        user_directory = os.path.join(settings.MEDIA_ROOT, f'user_{self.username}')
        total_size = 0

        for dirpath, dirnames, filenames in os.walk(user_directory):
            for f in filenames:
                fp = os.path.join(dirpath, f)
                if os.path.exists(fp):
                    total_size += os.path.getsize(fp)

        self.total_size = total_size
        self.save(update_fields=['total_size'])

    
    def __str__(self):
        return self.username

