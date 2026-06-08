import datetime
from rest_framework import viewsets, response
from rest_framework.decorators import action
from django.db.models import Sum
from .models import Financeiro, ExercicioFinanceiro
from .serializers import FinanceiroSerializer, AnosDisponiveisSerializer

class FinanceiroViewSet(viewsets.ModelViewSet):
    queryset = Financeiro.objects.all().order_by('data', 'id')
    serializer_class = FinanceiroSerializer
    pagination_class = None

    def get_queryset(self):
        queryset = super().get_queryset()
        ano = self.request.query_params.get('ano')
        if ano:
            queryset = queryset.filter(exercicio__ano=ano)
        return queryset

    @action(detail=False, methods=['get'])
    def anos(self, request):
        exercicios = ExercicioFinanceiro.objects.all().order_by('ano')
        serializer = AnosDisponiveisSerializer(exercicios, many=True)
        return response.Response(serializer.data)

    @action(detail=False, methods=['get'])
    def resumo(self, request):
        ano_str = request.query_params.get('ano', str(datetime.date.today().year))
        ano_atual = int(ano_str)

        exercicio, created = ExercicioFinanceiro.objects.get_or_create(ano=ano_atual)

        # Se o ano estiver aberto, calcula o fluxo dinamicamente na hora
        if exercicio.aberto:
            saldo_anterior = exercicio.saldo_inicial_transportado
            transacoes_atuais = Financeiro.objects.filter(exercicio=exercicio)
            total_entrada = transacoes_atuais.filter(tipo='ENTRADA').aggregate(Sum('valor'))['valor__sum'] or 0
            total_saida = transacoes_atuais.filter(tipo='SAIDA').aggregate(Sum('valor'))['valor__sum'] or 0
            saldo_exercicio = total_entrada - total_saida
            saldo_final = saldo_anterior + saldo_exercicio
        else:
            # Se o ano estiver fechado, extrai os valores congelados do cofre auditado
            saldo_anterior = exercicio.saldo_inicial_transportado
            total_entrada = exercicio.total_entrada_fechamento
            total_saida = exercicio.total_saida_fechamento
            saldo_exercicio = total_entrada - total_saida
            saldo_final = exercicio.saldo_final_fechamento

        return response.Response({
            "ano": exercicio.ano,
            "aberto": exercicio.aberto,
            "saldo_anterior": float(saldo_anterior),
            "total_entrada": float(total_entrada),
            "total_saida": float(total_saida),
            "saldo_exercicio": float(saldo_exercicio),
            "saldo_final": float(saldo_final),
            "status": "AZUL" if saldo_final >= 0 else "VERMELHO"
        })  