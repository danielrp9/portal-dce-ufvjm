from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter

from noticias.views import NoticiaViewSet
from agenda.views import EventoViewSet
from documentos.views import DocumentoViewSet
from financeiro.views import FinanceiroViewSet
from core.views import serve_frontend

# Roteador da API
router = DefaultRouter()
router.register(r'noticias', NoticiaViewSet)
router.register(r'eventos', EventoViewSet)
router.register(r'documentos', DocumentoViewSet)
router.register(r'financeiro', FinanceiroViewSet)

urlpatterns = [
    # 1. Painel Administrativo e API de dados
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    
    # 2. Rotas visuais explícitas servindo os arquivos estáticos de forma dinâmica (sem cache)
    path('', serve_frontend, {'path': 'index.html'}, name='frontend-home'),
    path('noticias/', serve_frontend, {'path': 'noticias/index.html'}, name='frontend-noticias'),
    path('documentos/', serve_frontend, {'path': 'documentos/index.html'}, name='frontend-documentos'),
    path('eventos/', serve_frontend, {'path': 'eventos/index.html'}, name='frontend-eventos'),
    path('transparencia/', serve_frontend, {'path': 'transparencia/index.html'}, name='frontend-transparencia'),
    path('sobre/', serve_frontend, {'path': 'sobre/index.html'}, name='frontend-sobre'),

    # 3. INTERCEPTADOR DINÂMICO PARA DETALHES
    re_path(r'^noticias/[a-zA-Z0-9_-]+/?$', serve_frontend, {'path': 'noticias/detalhe/index.html'}, name='frontend-noticia-detail'),

    # 4. FALLBACK GERAL
    re_path(
        r'^(?!admin|api|static|media)(?P<path>.*)/?$', 
        serve_frontend, 
        name='frontend-fallback'
    ),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
