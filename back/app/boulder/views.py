from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from django.core.files.base import ContentFile
import cv2
import numpy as np
from .models import Boulder
from .serializers import BoulderSerializer
from .process_route import detect_holds, hsv_from_position
from .analyse_route import generate_route_tips


class BoulderView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = BoulderSerializer
    queryset = Boulder.objects.all()
    lookup_field = 'id'

<<<<<<< Updated upstream:back/app/boulder/views.py
    def post(self, request, id):
        boulder = get_object_or_404(Boulder, id=id)
=======
<<<<<<< Updated upstream:app/boulder/views.py
=======
    def post(self, request, id):
        boulder = get_object_or_404(Boulder, id=id, created_by=request.user)
>>>>>>> Stashed changes:app/boulder/views.py
        positions = request.data.get('positions')

        if positions is None:
            return Response({"error": "No positions provided"}, status=status.HTTP_400_BAD_REQUEST)

        boulder.positions = positions
        boulder.save()

        serializer = BoulderSerializer(boulder)
        return Response(serializer.data, status=status.HTTP_200_OK)

<<<<<<< Updated upstream:back/app/boulder/views.py


=======
>>>>>>> Stashed changes:back/app/boulder/views.py
>>>>>>> Stashed changes:app/boulder/views.py

class BoulderProcessView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']
    ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']


    def post(self, request):
        img_file = request.FILES.get("image")
        if not img_file:
            return Response({"error": "No image uploaded"}, status=status.HTTP_400_BAD_REQUEST)
        ext = os.path.splitext(img_file.name)[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            return Response({"error": "Invalid file type"}, status=status.HTTP_400_BAD_REQUEST)

        if img_file.content_type not in ALLOWED_MIME_TYPES:
            return Response({"error": "Invalid file type"}, status=status.HTTP_400_BAD_REQUEST)

        # Read image for processing
        file_bytes = np.frombuffer(img_file.read(), np.uint8)
        img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

        if img is None:
            return Response({"error": "Invalid image"}, status=status.HTTP_400_BAD_REQUEST)

<<<<<<< Updated upstream:back/app/boulder/views.py
        pick_x = request.data.get("pick_x")
        pick_y = request.data.get("pick_y")

        color = None
        if pick_x is not None and pick_y is not None:
            try:
                x = int(float(pick_x))
                y = int(float(pick_y))
                color = hsv_from_position(img, x, y)
            except Exception:
                color = None


        holds = detect_holds(img, color)
=======
<<<<<<< Updated upstream:app/boulder/views.py
        positions = detect_holds(img)
=======
        pick_x = request.data.get("pick_x")
        pick_y = request.data.get("pick_y")
>>>>>>> Stashed changes:app/boulder/views.py

        color = None
        if pick_x is not None and pick_y is not None:
            try:
                x = int(float(pick_x))
                y = int(float(pick_y))
                color = hsv_from_position(img, x, y)
            except (ValueError, TypeError):
                pass

        holds = detect_holds(img, color)
>>>>>>> Stashed changes:back/app/boulder/views.py

        # Create boulder with image and user
        boulder = Boulder.objects.create(
<<<<<<< Updated upstream:back/app/boulder/views.py
            positions=holds,
=======
<<<<<<< Updated upstream:app/boulder/views.py
            positions=positions,
>>>>>>> Stashed changes:app/boulder/views.py
            summary=""
=======
            positions=holds,
            summary="",
            created_by=request.user
>>>>>>> Stashed changes:back/app/boulder/views.py
        )
        
        # Save the original uploaded image
        img_file.seek(0)
        boulder.image.save(f'boulder_{boulder.id}.jpg', ContentFile(img_file.read()), save=True)

        serializer = BoulderSerializer(boulder)

        return Response(
            {"message": "Image processed successfully", "boulder": serializer.data},
            status=status.HTTP_201_CREATED
        )


class BoulderSummarizeView(generics.GenericAPIView):
    queryset = Boulder.objects.all()
    serializer_class = BoulderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        boulder_id = kwargs.get("id")
        boulder = get_object_or_404(Boulder, id=boulder_id, created_by=request.user)

        if boulder.summary and boulder.summary.strip():
            return Response(
                {
                    "message": "Summary already exists",
                    "boulder": self.serializer_class(boulder).data,
                },
                status=status.HTTP_200_OK,
            )

        coords = boulder.positions
        boulder.summary = generate_route_tips(coords)
        boulder.save()

        serializer = self.serializer_class(boulder)

        return Response(
            {
                "message": "Summary generated successfully",
                "boulder": serializer.data,
            },
            status=status.HTTP_200_OK,
        )
