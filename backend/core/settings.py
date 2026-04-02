import os
from pathlib import Path
from dj_database_url import parse as db_url # Necessário: pip install dj-database-url

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
# Em produção, o serviço de hospedagem fornecerá uma SECRET_KEY real
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-substitua-isso-por-uma-chave-segura')

# SECURITY WARNING: don't run with debug turned on in production!
# Muda para False automaticamente se houver uma variável de ambiente DEBUG=False
DEBUG = os.environ.get('DEBUG', 'True') == 'True'

# Configuração de Hosts: Aceita localhost e domínios da Vercel/Railway/Render
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'localhost 127.0.0.1 .vercel.app .railway.app .render.com').split()

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
    'corsheaders',
    'ckeditor',
    
    # Apps Locais
    'dce_portal',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', # Deve ser o primeiro
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware', # Necessário para arquivos estáticos em produção
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
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
# Em produção, utiliza a DATABASE_URL (PostgreSQL). Em local, utiliza SQLite.
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
# Armazenamento otimizado para produção
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Configuração de arquivos de mídia (Uploads)
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# CORS Config
# Em desenvolvimento (DEBUG=True) libera tudo. Em produção, libera apenas o frontend oficial.
if DEBUG:
    CORS_ALLOW_ALL_ORIGINS = True
else:
    CORS_ALLOW_ALL_ORIGINS = False
    CORS_ALLOWED_ORIGINS = [
        os.environ.get('FRONTEND_URL', 'http://localhost:3000'),
    ]

# CSRF Config para produção
CSRF_TRUSTED_ORIGINS = [
    os.environ.get('FRONTEND_URL', 'http://localhost:3000'),
]

# CKEditor Config
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
}

# URL DO FRONTEND PARA REDIRECIONAMENTO DO ADMIN
FRONTEND_URL = os.environ.get('FRONTEND_URL', "http://localhost:3000")