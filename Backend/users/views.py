import logging
from django.contrib.auth import authenticate, login, logout
from rest_framework import permissions, viewsets, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import action
from .models import MyUser
from .serializers import UserSerializers, RegisterSerializer, LoginSerializer

logger = logging.getLogger('main')

class MyUserViewSet(viewsets.ModelViewSet):
    queryset = MyUser.objects.all()
    serializer_class = UserSerializers
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        if self.request.user.is_superuser:
            logger.info(f'Superuser {self.request.user} accessed user list')
            return MyUser.objects.all()
        logger.warning(f'User {self.request.user} attempted to access user list')
        raise PermissionDenied("Only superusers can view the user list.")

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        """
        Returns the current authenticated user's data
        """
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Create tokens
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            # Automatically log in the user
            login(request, user)

            # Return the response with tokens
            return Response({
                "user_id": user.id,
                "username": user.username,
                "refresh": str(refresh),
                "access": access_token,
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        refresh = RefreshToken.for_user(user)
        login(request, user)
        logger.info(f'User {user.username} successfully logged in')
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_200_OK)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            logger.info(f'User {request.user} successfully logged out')
            logout(request)
            return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f'Logout error: {e}')
            return Response({'error': 'An error occurred during logout'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 