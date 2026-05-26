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

# Custom TemplateView para resolver o caminho do slug dinamicamente
class DinamicNoticiaTemplateView(TemplateView):
    def get_template_names(self):
        slug = self.kwargs.get('slug')
        return [f'noticias/{slug}/index.html']

urlpatterns = [
    # 1. Painel Administrativo e API de dados (Sempre no topo)
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    
    # 2. Rotas visuais explícitas de listagens fixas
    path('noticias', TemplateView.as_view(template_name='noticias/index.html'), name='frontend-noticias'),
    path('noticias/', TemplateView.as_view(template_name='noticias/index.html'), name='frontend-noticias-slash'),
    path('documentos', TemplateView.as_view(template_name='documentos/index.html'), name='frontend-documentos'),
    path('documentos/', TemplateView.as_view(template_name='documentos/index.html'), name='frontend-documentos-slash'),
    path('eventos', TemplateView.as_view(template_name='eventos/index.html'), name='frontend-eventos'),
    path('eventos/', TemplateView.as_view(template_name='eventos/index.html'), name='frontend-eventos-slash'),
    path('transparencia', TemplateView.as_view(template_name='transparencia/index.html'), name='frontend-transparencia'),
    path('transparencia/', TemplateView.as_view(template_name='transparencia/index.html'), name='frontend-transparencia-slash'),
    path('sobre', TemplateView.as_view(template_name='sobre/index.html'), name='frontend-sobre'),
    path('sobre/', TemplateView.as_view(template_name='sobre/index.html'), name='frontend-sobre-slash'),

    # 3. ROTA DINÂMICA CORRIGIDA: Mapeia o slug capturado direto para a pasta correspondente exportada pelo Next.js
    path('noticias/<slug:slug>', DinamicNoticiaTemplateView.as_view(), name='frontend-noticia-detail'),
    path('noticias/<slug:slug>/', DinamicNoticiaTemplateView.as_view(), name='frontend-noticia-detail-slash'),

    # 4. ROTA CORINGA RESTRITA: Fallback para caminhos gerais sem colidir com assets ou admin
    re_path(
        r'^(?!admin|api|static|media)(?P<path>.*)/?$', 
        TemplateView.as_view(template_name='index.html'), 
        name='frontend-fallback'
    ),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)