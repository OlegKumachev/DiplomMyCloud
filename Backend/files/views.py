import logging
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from .models import File
from django.http import FileResponse, Http404
from .serializers import FileSerializers
import os
from django.shortcuts import get_object_or_404
from django.core.files.storage import default_storage


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

   
        
    @action(detail=False, methods=['get'], url_path='user_files/(?P<user_id>\d+)')
    def admin_get_files(self, request, user_id=None):
        """
        Returns files for a specific user ID.
        """
        try:
            if not request.user.is_superuser:
                return Response({'error': 'Only superusers can access files for other users.'}, status=status.HTTP_403_FORBIDDEN)
            
            user = get_object_or_404(MyUser, id=user_id)
            queryset = File.objects.filter(user=user)
            serializer = self.get_serializer(queryset, many=True)
            logger.info(f'Файлы для пользователя с ID {user_id} запрошены администратором {request.user}')
            return Response(serializer.data)
        except MyUser.DoesNotExist:
            logger.error(f'Пользователь с ID {user_id} не найден.')
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f'Ошибка получения файлов для пользователя с ID {user_id}: {e}')
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            
    def destroy(self, request, *args, **kwargs):
        try:
            if self.request.user.is_superuser:
                file_instance = get_object_or_404(File, pk=kwargs.get('pk'))
            else:
                file_instance = self.get_object()

            logger.info(f'Запрос на удаление файла с ID {file_instance.id} от пользователя {request.user}')

            if not (file_instance.user == request.user or request.user.is_superuser):
                return Response({'error': 'You do not have permission to delete this file.'}, status=status.HTTP_403_FORBIDDEN)

            file_path = file_instance.file.path

            if os.path.exists(file_path):
                os.remove(file_path)
                logger.info(f'Файл {file_path} успешно удален с файловой системы')
            else:
                logger.warning(f'Файл {file_path} не найден на файловой системе')

            file_instance.delete()
            logger.info(f'Запись о файле с ID {file_instance.id} успешно удалена из базы данных')
            return Response(status=status.HTTP_204_NO_CONTENT)

        except File.DoesNotExist:
            logger.error(f'Файл с ID {kwargs.get("pk")} не найден для удаления')
            return Response({'error': 'File not found.'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            logger.error(f'Ошибка при удалении файла с ID {kwargs.get("pk")}: {e}')
            return Response({'error': 'Failed to delete file.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

    @action(detail=True, methods=['get'], url_path='download')
    def download_file(self, request, pk=None):
        try:
            file_instance = File.objects.get(pk=pk)
            if not (file_instance.user == request.user or request.user.is_superuser):
                return Response({'error': 'У вас нет прав доступа к этому файлу.'}, status=status.HTTP_403_FORBIDDEN)
            file_path = file_instance.file.path
            if not os.path.exists(file_path):
                raise Http404("Файл не найден")
            response = FileResponse(open(file_path, 'rb'), as_attachment=True, filename=file_instance.original_name)
            return response
        except File.DoesNotExist:
            return Response({'error': 'Файл не найден.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception:
            return Response({'error': 'Не удалось скачать файл.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    
    def partial_update(self, request, *args, **kwargs):
        try:
            if self.request.user.is_superuser:
                file_instance = get_object_or_404(File, pk=kwargs.get('pk'))
            else:
                file_instance = self.get_object()

            # Проверка прав доступа
            if not (file_instance.user == request.user or request.user.is_superuser):
                return Response({'error': 'У вас нет прав для обновления этого файла.'}, status=status.HTTP_403_FORBIDDEN)

            # Создаем и проверяем сериализатор
            serializer = self.get_serializer(file_instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)

            # Сохраняем обновленные данные в базе данных
            self.perform_update(serializer)

            # Обновляем имя файла на диске
            old_file_path = file_instance.file.path
            new_file_name = serializer.validated_data.get('original_name', file_instance.file.name.split('/')[-1])

            # Получаем расширение старого файла
            file_extension = os.path.splitext(old_file_path)[1]
            new_file_name_with_extension = f"{new_file_name}{file_extension}"

            # Конструируем новый путь
            new_file_path = os.path.join(os.path.dirname(old_file_path), new_file_name_with_extension)

            # Проверяем существование старого файла
            if not default_storage.exists(old_file_path):
                logger.error(f'Файл не найден: {old_file_path}')
                return Response({'error': 'Файл не найден на диске.'}, status=status.HTTP_404_NOT_FOUND)

            # Переименовываем файл на диске
            with default_storage.open(old_file_path, 'rb') as old_file:
                default_storage.save(new_file_path, old_file)
            default_storage.delete(old_file_path)

            # Обновляем имя файла в базе данных
            file_instance.file.name = new_file_path
            file_instance.save()

            logger.info(f'Файл успешно обновлен: {old_file_path} -> {new_file_path}')

            return Response(serializer.data)

        except Exception as e:
            logger.error(f'Ошибка при обновлении файла: {e}')
            return Response({'error': 'Не удалось обновить файл.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DownloadFileViewSet(ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileSerializers
    
    @action(detail=True, methods=['get'], url_path='liberty_link')
    def download_file(self, request, pk=None):
        # Получаем объект файла из базы данных
        file_instance = get_object_or_404(File, id=pk)
        
        # Путь к файлу на сервере
        file_path = file_instance.file.path
        
        # Проверка существования файла
        if not os.path.exists(file_path):
            raise Http404("Файл не найден")

        # Отправляем файл пользователю
        response = FileResponse(open(file_path, 'rb'), as_attachment=True, filename=file_instance.original_name)
        return response