import logging
from django.shortcuts import render
from rest_framework import permissions, viewsets, status
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login, logout

from .models import MyUser
from .serializers import UserSerializers, RegisterSerializer

logger = logging.getLogger('main')

class MyUserViewSet(viewsets.ModelViewSet):
    queryset = MyUser.objects.all()
    serializer_class = UserSerializers
    permission_classes = [permissions.IsAdminUser]
    def get_queryset(self):
        if self.request.user.is_superuser:
            logger.info(f'Суперпользователь {self.request.user} получил доступ к списку пользователей')
            return MyUser.objects.all()
        logger.warning(f'Пользователь {self.request.user} попытался получить доступ к списку пользователей')
        raise PermissionDenied("Только суперпользователи могут просматривать список пользователей.")

class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            logger.info(f'Пользователь {user.username} успешно зарегистрирован')
            return Response({"user_id": user.id, "username": user.username}, status=status.HTTP_201_CREATED)
        logger.error('Регистрация пользователя не удалась', extra={'errors': serializer.errors})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        try:
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                logger.info(f'Пользователь {username} успешно вошел в систему')
                return Response({'message': 'Вход выполнен успешно'}, status=status.HTTP_200_OK)
            logger.warning(f'Неудачная попытка входа для имени пользователя: {username}')
            return Response({'error': 'Неверные учетные данные'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f'Ошибка входа: {e}')
            return Response({'error': 'Произошла ошибка при входе'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            logger.info(f'Пользователь {request.user} успешно вышел из системы')
            logout(request)
            return Response({'message': 'Выход выполнен успешно'}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f'Ошибка выхода: {e}')
            return Response({'error': 'Произошла ошибка при выходе'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
