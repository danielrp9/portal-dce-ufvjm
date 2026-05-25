from rest_framework import viewsets
from .models import Documento
from .serializers import DocumentoSerializer

class DocumentoViewSet(viewsets.ModelViewSet):
    queryset = Documento.objects.all().order_by('-data_upload')
    serializer_class = DocumentoSerializer