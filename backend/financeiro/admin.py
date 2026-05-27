from django.contrib import admin
from django.contrib import messages
from django.shortcuts import render
from django.http import HttpResponseRedirect
from .models import Financeiro, ExercicioFinanceiro

@admin.register(ExercicioFinanceiro)
class ExercicioFinanceiroAdmin(admin.ModelAdmin):
    list_display = (
        'ano', 
        'aberto', 
        'saldo_inicial_transportado', 
        'saldo_final_fechamento'
    )
    list_filter = ('aberto',)
    search_fields = ('ano',)
    
    # Removemos o campo 'aberto' da edição comum para evitar cliques acidentais
    fields = ('ano',)
    readonly_fields = (
        'saldo_inicial_transportado', 
        'total_entrada_fechamento', 
        'total_saida_fechamento', 
        'saldo_final_fechamento'
    )
    
    actions = ['encerrar_exercicio_action']

    def encerrar_exercicio_action(self, request, queryset):
        # Se o usuário apenas selecionou a ação, mas não confirmou ainda
        if 'apply' not in request.POST:
            # Verifica se algum dos anos selecionados já está fechado
            if queryset.filter(aberto=False).exists():
                self.message_user(
                    request, 
                    "Erro: Um ou mais exercícios selecionados já encontram-se encerrados.", 
                    messages.ERROR
                )
                return HttpResponseRedirect(request.get_full_path())
                
            # Renderiza a página intermediária de aviso crítico e irreversível
            return render(request, 'admin/financeiro/confirmar_encerramento.html', context={
                'exercicios': queryset,
                'action_checkbox_name': admin.helpers.ACTION_CHECKBOX_NAME
            })
        
        # Fluxo executado após o administrador clicar em "Sim, tenho certeza e quero encerrar"
        count = 0
        for exercicio in queryset:
            if exercicio.aberto:
                exercicio.aberto = False
                exercicio.save()  # Dispara toda a lógica interna de congelamento do models.py
                count += 1
                
        self.message_user(
            request, 
            f"Sucesso: {count} exercício(s) financeiro(s) selado(s) e congelado(s) definitivamente.", 
            messages.SUCCESS
        )
        return HttpResponseRedirect(request.get_full_path())

    encerrar_exercicio_action.short_description = "🔒 Encerrar e Selar Exercício Selecionado"


@admin.register(Financeiro)
class FinanceiroAdmin(admin.ModelAdmin):
    list_display = ('descricao', 'valor', 'tipo', 'data', 'exercicio')
    list_filter = ('tipo', 'data', 'exercicio')
    search_fields = ('descricao',)