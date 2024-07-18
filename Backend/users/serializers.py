from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from .models import MyUser


class UserSerializers(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = ['username', 'email', 'is_superuser', 'password', 'storage_path']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):

        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        return super().update(instance, validated_data)


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):

        user = MyUser.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data['email']
            )
        return user



