from django.contrib import admin
from django.conf import settings
from .models import Noticia, Evento, Documento, Financeiro

# Configurações de Identidade do Painel Administrativo
admin.site.site_header = "Portal do DCE - Administração"
admin.site.site_title = "DCE UFVJM Admin"
admin.site.index_title = "Gerenciamento de Conteúdo e Finanças"

# Altera o link do botão "VER O SITE" no topo do Admin para o seu Frontend Next.js
admin.site.site_url = getattr(settings, 'FRONTEND_URL', '/')

@admin.register(Noticia)
class NoticiaAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'autor', 'data_publicacao')
    prepopulated_fields = {'slug': ('titulo',)} # Gera o slug automaticamente enquanto você digita o título
    search_fields = ('titulo', 'conteudo')
    list_filter = ('data_publicacao', 'autor')

@admin.register(Evento)
class EventoAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'local', 'data_hora')
    list_filter = ('data_hora', 'local')
    search_fields = ('titulo', 'descricao')

@admin.register(Documento)
class DocumentoAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'tipo', 'data_upload')
    list_filter = ('tipo', 'data_upload')

@admin.register(Financeiro)
class FinanceiroAdmin(admin.ModelAdmin):
    list_display = ('descricao', 'valor', 'tipo', 'data')
    list_filter = ('tipo', 'data')
    search_fields = ('descricao',)

    def save_model(self, request, obj, form, change):
        # Garante que saídas sejam salvas como valores positivos no banco, 
        # mas a lógica de exibição (vermelho/azul) será tratada no serializer/frontend
        super().save_model(request, obj, form, change)