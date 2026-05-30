from rest_framework import serializers
from .models import Edital, DocumentoEdital

class DocumentoEditalSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentoEdital
        fields = '__all__'

class EditalSerializer(serializers.ModelSerializer):
    documentos = DocumentoEditalSerializer(many=True, read_only=True)
    campus_display = serializers.CharField(source='get_campus_display', read_only=True)
    
    class Meta:
        model = Edital
        fields = [
            'id', 'titulo', 'slug', 'descricao', 'campus', 
            'campus_display', 'data_publicacao', 'ativo', 'documentos'
        ]
