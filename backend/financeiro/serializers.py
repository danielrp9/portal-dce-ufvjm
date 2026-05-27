from rest_framework import serializers
from .models import Financeiro, ExercicioFinanceiro

class FinanceiroSerializer(serializers.ModelSerializer):
    status_caixa = serializers.ReadOnlyField()

    class Meta:
        model = Financeiro
        fields = [
            'id', 
            'exercicio', 
            'descricao', 
            'valor', 
            'tipo', 
            'data', 
            'status_caixa'
        ]


class ResumoFinanceiroSerializer(serializers.Serializer):
    total_entrada = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_saida = serializers.DecimalField(max_digits=12, decimal_places=2)
    saldo = serializers.DecimalField(max_digits=12, decimal_places=2)
    status = serializers.SerializerMethodField()

    def get_status(self, obj):
        return "AZUL" if obj['saldo'] >= 0 else "VERMELHO"


class AnosDisponiveisSerializer(serializers.ModelSerializer):
    """
    Serializador responsável por alimentar dinamicamente o seletor do front-end.
    Retorna apenas os anos cujas atividades já foram inicializadas no banco.
    """
    class Meta:
        model = ExercicioFinanceiro
        fields = ['ano']