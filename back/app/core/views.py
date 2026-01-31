from rest_framework import generics, permissions
from .models import Boulder
from .serializers import BoulderSerializer


class BoulderView(generics.ListCreateAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = Boulder.objects.all().order_by('-id')
    serializer_class = BoulderSerializer
