from rest_framework import serializers
from .models import Boulder


class BoulderSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = Boulder
        fields = ['id', 'positions', 'summary', 'image', 'created_by']
        read_only_fields = ['created_by']