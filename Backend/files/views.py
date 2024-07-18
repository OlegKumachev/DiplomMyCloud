import logging
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from .models import File
from .serializers import FileSerializers

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
