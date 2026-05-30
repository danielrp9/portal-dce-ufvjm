from rest_framework import viewsets
from .models import Edital
from .serializers import EditalSerializer

class EditalViewSet(viewsets.ModelViewSet):
    queryset = Edital.objects.all().order_by('-data_publicacao')
    serializer_class = EditalSerializer
    lookup_field = 'slug'
