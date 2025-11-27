import cv2
import numpy as np
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Boulder
from .serializers import BoulderSerializer
from .process_route import detect_holds


class BoulderView(generics.RetrieveAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = BoulderSerializer
    queryset = Boulder.objects.all()
    lookup_field = 'id'


class BoulderProcessView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        img = request.FILES.get("image")
        if not img:
            return Response({"error": "No image uploaded"}, status=400)

        file_bytes = np.frombuffer(img.read(), np.uint8)
        img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

        if img is None:
            return Response({"error": "Invalid image"}, status=400)

        positions = detect_holds(img)

        boulder = Boulder.objects.create(
            positions=positions,
            summary=""
        )

        serializer = BoulderSerializer(boulder)

        return Response(
            {"message": "Image processed successfully", "boulder": serializer.data}, # noqa: 501
            status=status.HTTP_201_CREATED
        )


class BoulderSummarizeView(generics.GenericAPIView):
    exit
