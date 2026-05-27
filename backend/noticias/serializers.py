from rest_framework import serializers
from .models import Noticia

class NoticiaSerializer(serializers.ModelSerializer):
    # Campo calculado para expor a label legível do campus na API
    campus_display = serializers.CharField(source='get_campus_display', read_only=True)

    class Meta:
        model = Noticia
        fields = '__all__'
        lookup_field = 'slug'