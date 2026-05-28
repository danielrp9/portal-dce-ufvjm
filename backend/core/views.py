import os
from django.conf import settings
from django.http import FileResponse, HttpResponseNotFound
from django.utils.cache import add_never_cache_headers

def serve_frontend(request, path='index.html'):
    """
    Serve os arquivos HTML do Next.js diretamente do sistema de arquivos.
    Ignora o sistema de templates do Django para evitar cache em memória.
    """
    # Se o caminho for vazio ou terminar em /, serve o index.html daquela pasta
    if not path or path == '':
        full_path = os.path.join(settings.BASE_DIR, '../frontend/out/index.html')
    elif path.endswith('/'):
        full_path = os.path.join(settings.BASE_DIR, '../frontend/out', path, 'index.html')
    else:
        # Tenta servir o arquivo direto ou index.html se for um diretório
        full_path = os.path.join(settings.BASE_DIR, '../frontend/out', path)
        if os.path.isdir(full_path):
            full_path = os.path.join(full_path, 'index.html')
        elif not os.path.exists(full_path) and not full_path.endswith('.html'):
            # Fallback para .html (ex: /noticias -> /noticias.html ou /noticias/index.html)
            potential_path = full_path + '.html'
            if os.path.exists(potential_path):
                full_path = potential_path
            else:
                potential_index = os.path.join(full_path, 'index.html')
                if os.path.exists(potential_index):
                    full_path = potential_index

    if not os.path.exists(full_path):
        # Se não achar nada, serve o index.html principal (fallback SPA)
        full_path = os.path.join(settings.BASE_DIR, '../frontend/out/index.html')

    if not os.path.exists(full_path):
        return HttpResponseNotFound("Frontend build not found.")

    response = FileResponse(open(full_path, 'rb'), content_type='text/html')
    
    # Adiciona headers de NO-CACHE agressivos
    add_never_cache_headers(response)
    response['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0, post-check=0, pre-check=0'
    response['Pragma'] = 'no-cache'
    response['Expires'] = '0'
    
    return response
