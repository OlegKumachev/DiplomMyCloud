import logging
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from .models import File
from django.http import HttpResponse, FileResponse
from .serializers import FileSerializers
import os
from django.utils import timezone

logger = logging.getLogger('main')

class FileViewSet(ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileSerializers
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        try:
            serializer.save(user=self.request.user)
            logger.info(f'Файл успешно создан для {self.request.user}')
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f'Ошибка создания файла для {self.request.user}: {e}')
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        try:
            queryset = File.objects.filter(user=self.request.user)
            logger.info(f'Запрошены файлы для {self.request.user}')
            return queryset
        except Exception as e:
            logger.error(f'Ошибка получения файлов для {self.request.user}: {e}')
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=True, methods=['get'], url_path='download')
    def download_file(self, request, pk=None):
        try:
            file_instance = self.get_object()
            if file_instance.user != request.user:
                return Response({'error': 'You do not have permission to access this file.'}, status=status.HTTP_403_FORBIDDEN)
            
            file_path = file_instance.file.path
            if not os.path.exists(file_path):
                raise Http404("File does not exist")
            
            response = FileResponse(open(file_path, 'rb'), as_attachment=True, filename=file_instance.original_name)
            return response
        except File.DoesNotExist:
            logger.error(f'Файл с ID {pk} не найден для {self.request.user}')
            return Response({'error': 'File not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f'Ошибка скачивания файла для {self.request.user}: {e}')
            return Response({'error': 'Failed to download file.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def generate_public_link(request, file_id):
        file = get_object_or_404(File, id=file_id)
        if not file.special_url:
            file.special_url = request.build_absolute_uri(f'/media/{file.file.name}')
            file.save()
        return JsonResponse({'public_link': file.special_url})

    def file_download(request, file_path):
        file = get_object_or_404(File, file=file_path)
        response = FileResponse(file.file.open(), content_type='application/octet-stream')
        response['Content-Disposition'] = f'attachment; filename="{file.original_name}"'
        return response