from rest_framework import viewsets
from .models import Noticia
from .serializers import NoticiaSerializer

class NoticiaViewSet(viewsets.ModelViewSet):
    queryset = Noticia.objects.all().order_by('-data_publicacao')
    serializer_class = NoticiaSerializer
    lookup_field = 'slug'
    filterset_fields = ['campus']
    search_fields = ['titulo', 'conteudo', 'tags']