import os
import mimetypes
from django.conf import settings
from django.http import FileResponse, HttpResponseNotFound
from django.utils.cache import add_never_cache_headers

def serve_frontend(request, path='index.html'):
    """
    Serve os arquivos do Next.js diretamente do sistema de arquivos.
    """
    # Determina o caminho completo
    if not path or path == '':
        full_path = os.path.join(settings.BASE_DIR, '../frontend/out/index.html')
    elif path.endswith('/'):
        full_path = os.path.join(settings.BASE_DIR, '../frontend/out', path, 'index.html')
    else:
        full_path = os.path.join(settings.BASE_DIR, '../frontend/out', path)
        
        # Se for um diretório, busca o index.html dentro dele
        if os.path.isdir(full_path):
            full_path = os.path.join(full_path, 'index.html')
        # Se o arquivo não existir e não tiver extensão, tenta .html (estratégia Next.js)
        elif not os.path.exists(full_path) and '.' not in os.path.basename(path):
            potential_path = full_path + '.html'
            if os.path.exists(potential_path):
                full_path = potential_path
            else:
                potential_index = os.path.join(full_path, 'index.html')
                if os.path.exists(potential_index):
                    full_path = potential_index

    # Fallback final para SPA (serve o index.html raiz se o arquivo não existir)
    if not os.path.exists(full_path):
        full_path = os.path.join(settings.BASE_DIR, '../frontend/out/index.html')

    if not os.path.exists(full_path):
        return HttpResponseNotFound("Frontend build not found.")

    # Detecta o tipo de conteúdo (MIME Type) dinamicamente
    content_type, _ = mimetypes.guess_type(full_path)
    if not content_type:
        content_type = 'text/html' # Fallback para HTML

    response = FileResponse(open(full_path, 'rb'), content_type=content_type)
    
    # Headers de cache
    add_never_cache_headers(response)
    if path.startswith('_next/'):
        # Arquivos do Next.js podem ter cache longo pois têm hash no nome
        response['Cache-Control'] = 'public, max-age=31536000, immutable'
    else:
        response['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    
    return response
