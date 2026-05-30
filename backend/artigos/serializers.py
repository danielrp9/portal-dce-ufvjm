from rest_framework import serializers
from .models import Artigo

class ArtigoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artigo
        fields = '__all__'
        lookup_field = 'slug'
