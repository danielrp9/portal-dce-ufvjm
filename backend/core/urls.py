from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from dce_portal.views import NoticiaViewSet, EventoViewSet, DocumentoViewSet, FinanceiroViewSet

# Configuração do Router para a API
router = DefaultRouter()
router.register(r'noticias', NoticiaViewSet)
router.register(r'eventos', EventoViewSet)
router.register(r'documentos', DocumentoViewSet)
router.register(r'financeiro', FinanceiroViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),  # Corrigido: urls em vez de path
    path('api/', include(router.urls)),
]

# Servir arquivos de mídia (imagens) durante o desenvolvimento
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)