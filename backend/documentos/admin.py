from django.contrib import admin
from .models import Documento

@admin.register(Documento)
class DocumentoAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'tipo', 'data_upload')
    list_filter = ('tipo', 'data_upload')
    search_fields = ('titulo',)