import cv2
import numpy as np
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Boulder
from .serializers import BoulderSerializer
from .process_route import detect_holds, hsv_from_position
from .analyse_route import generate_route_tips


class BoulderView(generics.RetrieveAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = BoulderSerializer
    queryset = Boulder.objects.all()
    lookup_field = 'id'

    def post(self, request, id):
        boulder = get_object_or_404(Boulder, id=id)
        positions = request.data.get('positions')

        if positions is None:
            return Response({"error": "No positions provided"}, status=status.HTTP_400_BAD_REQUEST)

        boulder.positions = positions
        boulder.save()

        serializer = BoulderSerializer(boulder)
        return Response(serializer.data, status=status.HTTP_200_OK)




class BoulderProcessView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        img = request.FILES.get("image")
        if not img:
            return Response({"error": "No image uploaded"}, status=400)

        file_bytes = np.frombuffer(img.read(), np.uint8)
        img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

        if img is None:
            return Response({"error": "Invalid image"}, status=400)

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

        boulder = Boulder.objects.create(
            positions=holds,
            summary=""
        )

        serializer = BoulderSerializer(boulder)

        return Response(
            {"message": "Image processed successfully", "boulder": serializer.data}, # noqa: 501
            status=status.HTTP_201_CREATED
        )


class BoulderSummarizeView(generics.GenericAPIView):
    queryset = Boulder.objects.all()
    serializer_class = BoulderSerializer

    def get(self, request, *args, **kwargs):
        boulder_id = kwargs.get("id")
        boulder = get_object_or_404(Boulder, id=boulder_id)

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
