from rest_framework import viewsets, response
from rest_framework.decorators import action
from django.db.models import Sum
from .models import Noticia, Evento, Documento, Financeiro, ExercicioFinanceiro
from .serializers import (
    NoticiaSerializer, EventoSerializer, 
    DocumentoSerializer, FinanceiroSerializer
)
import datetime

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
        # 1. Pega o ano da URL ou usa o atual
        ano_str = request.query_params.get('ano', str(datetime.date.today().year))
        ano_atual = int(ano_str)

        # 2. Busca ou cria o registro do Exercício
        exercicio, created = ExercicioFinanceiro.objects.get_or_create(ano=ano_atual)

        # 3. Cálculo do Saldo Anterior (Tudo que aconteceu antes do ano atual)
        transacoes_passadas = Financeiro.objects.filter(exercicio__ano__lt=ano_atual)
        entradas_passadas = transacoes_passadas.filter(tipo='ENTRADA').aggregate(Sum('valor'))['valor__sum'] or 0
        saidas_passadas = transacoes_passadas.filter(tipo='SAIDA').aggregate(Sum('valor'))['valor__sum'] or 0
        saldo_anterior = entradas_passadas - saidas_passadas

        # 4. Cálculo do Ano Atual
        transacoes_atuais = Financeiro.objects.filter(exercicio=exercicio)
        total_entrada = transacoes_atuais.filter(tipo='ENTRADA').aggregate(Sum('valor'))['valor__sum'] or 0
        total_saida = transacoes_atuais.filter(tipo='SAIDA').aggregate(Sum('valor'))['valor__sum'] or 0
        saldo_exercicio = total_entrada - total_saida

        # 5. Saldo Final Consolidado
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

# Outras ViewSets simples para manter o arquivo completo
class NoticiaViewSet(viewsets.ModelViewSet):
    queryset = Noticia.objects.all().order_by('-data_publicacao')
    serializer_class = NoticiaSerializer
    lookup_field = 'slug'

class EventoViewSet(viewsets.ModelViewSet):
    queryset = Evento.objects.all().order_by('data_hora')
    serializer_class = EventoSerializer

class DocumentoViewSet(viewsets.ModelViewSet):
    queryset = Documento.objects.all().order_by('-data_upload')
    serializer_class = DocumentoSerializer