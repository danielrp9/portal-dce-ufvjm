from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from rest_framework.routers import DefaultRouter

from noticias.views import NoticiaViewSet
from agenda.views import EventoViewSet
from documentos.views import DocumentoViewSet
from financeiro.views import FinanceiroViewSet

# Roteador da API
router = DefaultRouter()
router.register(r'noticias', NoticiaViewSet)
router.register(r'eventos', EventoViewSet)
router.register(r'documentos', DocumentoViewSet)
router.register(r'financeiro', FinanceiroViewSet)

urlpatterns = [
    # 1. Painel Administrativo e API de dados (Sempre no topo)
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    
    # 2. Rotas Fixas Mapeadas para os arquivos HTML exatos gerados pelo build do Next.js
    # Isso impede que o Django confunda as requisições de páginas reais do sistema
    path('', TemplateView.as_view(template_name='index.html'), name='frontend-home'),
    path('noticias', TemplateView.as_view(template_name='noticias.html'), name='frontend-noticias'),
    path('noticias/', TemplateView.as_view(template_name='noticias.html'), name='frontend-noticias-slash'),
    path('documentos', TemplateView.as_view(template_name='documentos.html'), name='frontend-documentos'),
    path('documentos/', TemplateView.as_view(template_name='documentos.html'), name='frontend-documentos-slash'),
    path('eventos', TemplateView.as_view(template_name='eventos.html'), name='frontend-eventos'),
    path('eventos/', TemplateView.as_view(template_name='eventos.html'), name='frontend-eventos-slash'),
    path('transparencia', TemplateView.as_view(template_name='transparencia.html'), name='frontend-transparencia'),
    path('transparencia/', TemplateView.as_view(template_name='transparencia.html'), name='frontend-transparencia-slash'),
    path('sobre', TemplateView.as_view(template_name='sobre.html'), name='frontend-sobre'),
    path('sobre/', TemplateView.as_view(template_name='sobre.html'), name='frontend-sobre-slash'),

    # 3. ROTA CORINGA RESTRETA: Captura apenas os arquivos internos (.txt, payloads e sub-rotas dinâmicas como slugs)
    # Evita que o Django intercepte as requisições legítimas do roteador do Next.js de forma agressiva
    re_path(r'^(?P<path>.*)/?$', TemplateView.as_view(template_name='index.html'), name='frontend-fallback'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)