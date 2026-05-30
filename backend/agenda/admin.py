from django.contrib import admin
from .models import Evento

@admin.register(Evento)
class EventoAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'local', 'data_hora', 'ativo')
    list_filter = ('ativo', 'data_hora', 'local')
    search_fields = ('titulo', 'descricao')