from django.contrib import admin
from .models import Financeiro, ExercicioFinanceiro

@admin.register(ExercicioFinanceiro)
class ExercicioFinanceiroAdmin(admin.ModelAdmin):
    list_display = ('ano', 'aberto', 'relatorio_pdf')
    list_filter = ('aberto',)
    search_fields = ('ano',)

@admin.register(Financeiro)
class FinanceiroAdmin(admin.ModelAdmin):
    list_display = ('descricao', 'valor', 'tipo', 'data', 'exercicio')
    list_filter = ('tipo', 'data', 'exercicio')
    search_fields = ('descricao',)

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)