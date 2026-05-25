import datetime
from rest_framework import viewsets, response
from rest_framework.decorators import action
from django.db.models import Sum
from .models import Financeiro, ExercicioFinanceiro
from .serializers import FinanceiroSerializer

class FinanceiroViewSet(viewsets.ModelViewSet):
    queryset = Financeiro.objects.all().order_by('-data')
    serializer_class = FinanceiroSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        ano = self.request.query_params.get('ano')
        if ano:
            queryset = queryset.filter(exercicio__ano=ano)
        return queryset

    @action(detail=False, methods=['get'])
    def resumo(self, request):
        ano_str = request.query_params.get('ano', str(datetime.date.today().year))
        ano_atual = int(ano_str)

        exercicio, created = ExercicioFinanceiro.objects.get_or_create(ano=ano_atual)

        transacoes_passadas = Financeiro.objects.filter(exercicio__ano__lt=ano_atual)
        entradas_passadas = transacoes_passadas.filter(tipo='ENTRADA').aggregate(Sum('valor'))['valor__sum'] or 0
        saidas_passadas = transacoes_passadas.filter(tipo='SAIDA').aggregate(Sum('valor'))['valor__sum'] or 0
        saldo_anterior = entradas_passadas - saidas_passadas

        transacoes_atuais = Financeiro.objects.filter(exercicio=exercicio)
        total_entrada = transacoes_atuais.filter(tipo='ENTRADA').aggregate(Sum('valor'))['valor__sum'] or 0
        total_saida = transacoes_atuais.filter(tipo='SAIDA').aggregate(Sum('valor'))['valor__sum'] or 0
        saldo_exercicio = total_entrada - total_saida

        saldo_final = saldo_anterior + saldo_exercicio

        return response.Response({
            "ano": exercicio.ano,
            "aberto": exercicio.aberto,
            "relatorio_pdf": exercicio.relatorio_pdf.url if exercicio.relatorio_pdf else None,
            "saldo_anterior": float(saldo_anterior),
            "total_entrada": float(total_entrada),
            "total_saida": float(total_saida),
            "saldo_exercicio": float(saldo_exercicio),
            "saldo_final": float(saldo_final),
            "status": "AZUL" if saldo_final >= 0 else "VERMELHO"
        })