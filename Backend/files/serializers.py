from rest_framework import serializers, generics
from .models import File


class FileSerializers(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['id', 'user_id', 'file', 'comment', 'original_name', 'size_n']
        read_only_fields = ['user_id']

    def update(self, instance, validated_data):
        instance.comment = validated_data.get('comment', instance.comment)
        if 'original_name' in validated_data:
            instance.original_name = validated_data['original_name']
        
        instance.save()
        return instance