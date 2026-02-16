from django.contrib import admin
from django.urls import path, include
from core.views import CurrentUserView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('allauth.urls')),
    path('api/auth/user/', CurrentUserView.as_view(), name='current-user'),
    path('api/', include('boulder.urls')),
]
