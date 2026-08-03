import os
from pathlib import Path
from dj_database_url import parse as db_url # Necessário: pip install dj-database-url

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-substitua-isso-por-uma-chave-segura')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get('DEBUG', 'True') == 'True'

# Configuração de Hosts
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'localhost 127.0.0.1 0.0.0.0 .vercel.app .pythonanywhere.com .railway.app .render.com .ngrok-free.app .ngrok.io').split()

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Bibliotecas de Terceiros
    'rest_framework',
    'django_filters',
    'corsheaders',
    'ckeditor',
    
    # Apps Locais
    'noticias',
    'agenda',
    'documentos',
    'financeiro',
    'artigos',
    'editais',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'core.middleware.DisableClientSideCachingMiddleware', # Garante que nada (incluindo WhiteNoise) cacheie o que não deve
    'corsheaders.middleware.CorsMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware', 
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

# Mapeia onde estão os arquivos estáticos internos gerados pelo Next.js (se a pasta existir)
FRONTEND_OUT = os.path.join(BASE_DIR, '../frontend/out')
TEMPLATE_DIRS = [os.path.join(BASE_DIR, 'templates')]
if os.path.exists(FRONTEND_OUT):
    TEMPLATE_DIRS.insert(0, FRONTEND_OUT)

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': TEMPLATE_DIRS,
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

# Database
# No servidor, eles devem prover a variável de ambiente DATABASE_URL
# Exemplo: postgres://usuario:senha@host:porta/nome_do_banco
DATABASES = {
    'default': os.environ.get('DATABASE_URL') and db_url(os.environ.get('DATABASE_URL')) or {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Internationalization
LANGUAGE_CODE = 'pt-br'
TIME_ZONE = 'America/Sao_Paulo'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

STATICFILES_DIRS = []
if os.path.exists(FRONTEND_OUT):
    STATICFILES_DIRS.append(FRONTEND_OUT)

# Correção para o WhiteNoise não ignorar pastas ocultas do compilador se houver resquícios
WHITENOISE_ALLOW_ALL_ORIGINS = True

# Armazenamento otimizado para produção e desenvolvimento local unificado
if DEBUG:
    # Em desenvolvimento, evita compressões rígidas que barram o carregamento imediato do runserver
    STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'
else:
    STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Configuração de arquivos de mídia (Uploads)
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# CORS Config
if DEBUG:
    CORS_ALLOW_ALL_ORIGINS = True
    CSRF_TRUSTED_ORIGINS = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "https://*.ngrok-free.app",
        "https://*.ngrok.io"
    ]
else:
    if os.environ.get('CORS_ALLOW_ALL_ORIGINS', 'True') == 'True':
        CORS_ALLOW_ALL_ORIGINS = True
    else:
        CORS_ALLOW_ALL_ORIGINS = False
        CORS_ALLOWED_ORIGINS = os.environ.get('CORS_ALLOWED_ORIGINS', os.environ.get('FRONTEND_URL', 'http://localhost:3000')).split()
    
    CSRF_TRUSTED_ORIGINS = os.environ.get('CSRF_TRUSTED_ORIGINS', os.environ.get('FRONTEND_URL', 'http://localhost:3000')).split()
    if os.environ.get('FRONTEND_URL') and os.environ.get('FRONTEND_URL') not in CSRF_TRUSTED_ORIGINS:
        CSRF_TRUSTED_ORIGINS.append(os.environ.get('FRONTEND_URL'))

CKEDITOR_CONFIGS = {
    'default': {
        'toolbar': 'full',
        'height': 300,
        'width': '100%',
    },
}

REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 6,
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
}

FRONTEND_URL = os.environ.get('FRONTEND_URL', 'https://portal-dce-ufvjm.vercel.app')
