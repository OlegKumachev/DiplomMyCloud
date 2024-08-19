import os
import logging
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from django.http import FileResponse, Http404
from .serializers import FileSerializers
from django.shortcuts import get_object_or_404
from django.core.files.storage import default_storage
from .models import MyUser
from .models import File


logger = logging.getLogger('main')

class FileViewSet(ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileSerializers
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        try:
            serializer.save(user=self.request.user)
            logger.info(f'File created {self.request.user}')
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f'Error creating file {self.request.user}: {e}')
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        try:
            queryset = File.objects.filter(user=self.request.user)
            logger.info(f'Requested files {self.request.user}')
            return queryset
        except Exception as e:
            logger.error(f'Error getting files {self.request.user}: {e}')
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

   
        
    @action(detail=False, methods=['get'], url_path='user_files/(?P<user_id>\d+)')
    def admin_get_files(self, request, user_id=None):
        try:
            if not request.user.is_superuser:
                return Response({'error': 'Only superusers can access files for other users.'}, status=status.HTTP_403_FORBIDDEN)
            else:
                user = get_object_or_404(MyUser, id=user_id)
                queryset = File.objects.filter(user=user)
                serializer = self.get_serializer(queryset, many=True)
                logger.info(f'Files for user with ID{user_id} requested by administrator {request.user}')
                return Response(serializer.data)
        except MyUser.DoesNotExist:
            logger.error(f'User ID {user_id} not found.')
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f'Error getting files for user with ID {user_id}: {e}')
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            
    def destroy(self, request, *args, **kwargs):
        try:
            if self.request.user.is_superuser:
                file_instance = get_object_or_404(File, pk=kwargs.get('pk'))
            else:
                file_instance = self.get_object()

            logger.info(f'Request to delete file with ID {file_instance.id} from user {request.user}')

            if not (file_instance.user == request.user or request.user.is_superuser):
                return Response({'error': 'You do not have permission to delete this file.'}, status=status.HTTP_403_FORBIDDEN)

            file_path = file_instance.file.path

            if os.path.exists(file_path):
                os.remove(file_path)
                logger.info(f'File {file_path} successfully removed')
            else:
                logger.warning(f'File {file_path} not found in data storage ')

            file_instance.delete()
            logger.info(f'File {file_instance.id} delete')
            return Response(status=status.HTTP_204_NO_CONTENT)

        except File.DoesNotExist:
            logger.error(f'File {kwargs.get("pk")} not found')
            return Response({'error': 'File not found.'}, status=status.HTTP_404_NOT_FOUND)
        
    

    @action(detail=True, methods=['get'], url_path='download')
    def download_file(self, request, pk=None):
        try:
            file_instance = File.objects.get(pk=pk)
            if not (file_instance.user == request.user or request.user.is_superuser):
                return Response({'error': 'You do not have permission to access this file.'}, status=status.HTTP_403_FORBIDDEN)
            file_path = file_instance.file.path
            if not os.path.exists(file_path):
                raise Http404("File not found")
            response = FileResponse(open(file_path, 'rb'), as_attachment=True, filename=file_instance.original_name)
            return response
        except File.DoesNotExist:
            return Response({'error': 'File not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception:
            return Response({'error': 'Failed to download file.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    
    def partial_update(self, request, *args, **kwargs):
        try:
            if self.request.user.is_superuser:
                file_instance = get_object_or_404(File, pk=kwargs.get('pk'))
            else:
                file_instance = self.get_object()

            if not (file_instance.user == request.user or request.user.is_superuser):
                return Response({'error': 'You do not have permission to update this file.'}, status=status.HTTP_403_FORBIDDEN)

            serializer = self.get_serializer(file_instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)

            self.perform_update(serializer)

         
            old_file_path = file_instance.file.path
            new_file_name = serializer.validated_data.get('original_name', file_instance.file.name.split('/')[-1])

            file_extension = os.path.splitext(old_file_path)[1]
            new_file_name_with_extension = f"{new_file_name}{file_extension}"

            new_file_path = os.path.join(os.path.dirname(old_file_path), new_file_name_with_extension)

      
            if not default_storage.exists(old_file_path):
                logger.error(f'File not found {old_file_path}')
                return Response({'error': 'File not found'}, status=status.HTTP_404_NOT_FOUND)

            with default_storage.open(old_file_path, 'rb') as old_file:
                default_storage.save(new_file_path, old_file)
            default_storage.delete(old_file_path)

            file_instance.file.name = new_file_path
            file_instance.save()

            logger.info(f'File updated successfully: {old_file_path} -> {new_file_path}')

            return Response(serializer.data)

        except Exception as e:
            logger.error(f'Error updating file: {e}')
            return Response({'error': 'Failed to update file.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DownloadFileViewSet(ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileSerializers
    
    @action(detail=True, methods=['get'], url_path='liberty_link')
    def download_file(self, request, pk=None):
       
        file_instance = get_object_or_404(File, id=pk)
        
        file_path = file_instance.file.path
        
        
        if not os.path.exists(file_path):
            raise Http404("File not found")

        
        response = FileResponse(open(file_path, 'rb'), as_attachment=True, filename=file_instance.original_name)
        return response