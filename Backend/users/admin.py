from django.contrib import admin

from .models import MyUser


# Register your models here.
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'is_superuser')


# Регистрируем модель Users с нашим пользовательским административным классом
admin.site.register(MyUser, UserAdmin)