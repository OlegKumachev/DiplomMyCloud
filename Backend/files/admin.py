from django.contrib import admin

from .models import File

class FileAdmin(admin.ModelAdmin):
    list_display = ('file', 'comment', 'data_created', 'user_id')


admin.site.register(File, FileAdmin)