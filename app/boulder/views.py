from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
import tempfile
from .models import Boulder
from .serializers import BoulderSerializer


def detect_holds(image_path):
    """
    TODO: replace with real YOLO inference.
    For now, returns dummy data.
    """
    return {
        "holds": [
            {"x": 120, "y": 300},
            {"x": 240, "y": 180},
        ]
    }


class BoulderView(generics.RetrieveAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = BoulderSerializer
    queryset = Boulder.objects.all()
    lookup_field = 'id'


class BoulderProcessView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        if "image" not in request.FILES:
            return Response({"error": "No image uploaded"}, status=400)

        image = request.FILES["image"]

        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp:
            for chunk in image.chunks():
                temp.write(chunk)
            temp_path = temp.name

        positions = detect_holds(temp_path)

        boulder = Boulder.objects.create(
            positions=positions,
            summary=""
        )

        serializer = BoulderSerializer(boulder)

        return Response({
            "message": "Image processed successfully",
            "boulder": serializer.data
        }, status=status.HTTP_201_CREATED)


class BoulderSummarizeView(generics.GenericAPIView):
    exit
