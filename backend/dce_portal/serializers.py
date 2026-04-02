from rest_framework import serializers
from .models import Noticia, Evento, Documento, Financeiro
from django.db.models import Sum

class NoticiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Noticia
        fields = '__all__'
        lookup_field = 'slug'

class EventoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evento
        fields = '__all__'

class DocumentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Documento
        fields = '__all__'

class FinanceiroSerializer(serializers.ModelSerializer):
    status_caixa = serializers.ReadOnlyField()

    class Meta:
        model = Financeiro
        fields = ['id', 'descricao', 'valor', 'tipo', 'data', 'status_caixa']

class ResumoFinanceiroSerializer(serializers.Serializer):
    total_entrada = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_saida = serializers.DecimalField(max_digits=12, decimal_places=2)
    saldo = serializers.DecimalField(max_digits=12, decimal_places=2)
    status = serializers.SerializerMethodField()

    def get_status(self, obj):
        return "AZUL" if obj['saldo'] >= 0 else "VERMELHO"