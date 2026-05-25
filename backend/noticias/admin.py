from django.contrib import admin
from .models import Noticia

@admin.register(Noticia)
class NoticiaAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'autor', 'data_publicacao')
    prepopulated_fields = {'slug': ('titulo',)}
    search_fields = ('titulo', 'conteudo')
    list_filter = ('data_publicacao', 'autor')