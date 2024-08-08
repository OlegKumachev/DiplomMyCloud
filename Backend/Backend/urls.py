from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from Backend import settings
from rest_framework.routers import DefaultRouter, SimpleRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from files.views import FileViewSet, DownloadFileViewSet
from users.views import MyUserViewSet, RegisterView, LogoutView, LoginView

#
router = DefaultRouter()

router.register(r'file', FileViewSet)
router.register(r'ad', MyUserViewSet)
router.register(r'download', DownloadFileViewSet, basename='download')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)