from rest_framework import viewsets
from .models import Artigo
from .serializers import ArtigoSerializer

class ArtigoViewSet(viewsets.ModelViewSet):
    queryset = Artigo.objects.all().order_by('-data_publicacao')
    serializer_class = ArtigoSerializer
    lookup_field = 'slug'
