from django.urls import path, include


urlpatterns = [
    path('boulder/', include('boulder.urls')),
]
