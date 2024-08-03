from rest_framework import serializers, generics
from .models import File


class FileSerializers(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['id', 'user_id', 'file', 'comment', 'original_name', 'size_n']
        read_only_fields = ['user_id']

    def update(self, instance, validated_data):
        instance.comment = validated_data.get('comment', instance.comment)
        instance.original_name = validated_data.get('original_name', instance.comment)

        instance.save()
        return instance
