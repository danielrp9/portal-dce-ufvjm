from django.contrib import admin
from .models import Edital, DocumentoEdital

class DocumentoEditalInline(admin.TabularInline):
    model = DocumentoEdital
    extra = 1

@admin.register(Edital)
class EditalAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'campus', 'data_publicacao', 'ativo')
    list_filter = ('ativo', 'campus', 'data_publicacao')
    search_fields = ('titulo', 'descricao')
    prepopulated_fields = {'slug': ('titulo',)}
    inlines = [DocumentoEditalInline]
