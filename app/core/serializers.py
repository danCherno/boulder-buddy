from rest_framework import serializers
from .models import Boulder


class BoulderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Boulder
        fields = ['id', 'positions', 'summary']
