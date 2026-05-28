from django.utils.cache import add_never_cache_headers

class DisableClientSideCachingMiddleware:
    """
    Middleware para garantir que o navegador nunca armazene em cache as respostas da API
    ou os arquivos HTML do frontend servidos pelo Django.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        
        path = request.path
        is_api = path.startswith('/api/')
        # Verifica se é uma rota de HTML (não é estático nem mídia)
        is_static_asset = path.startswith('/static/') or path.startswith('/media/')
        
        if is_api or not is_static_asset:
            # Força a expiração e impede armazenamento
            add_never_cache_headers(response)
            response['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0, post-check=0, pre-check=0'
            response['Pragma'] = 'no-cache'
            response['Expires'] = '0'
            
            # Remove ETag e Last-Modified para evitar que o navegador use 304 Not Modified
            if 'ETag' in response:
                del response['ETag']
            if 'Last-Modified' in response:
                del response['Last-Modified']
        
        return response
