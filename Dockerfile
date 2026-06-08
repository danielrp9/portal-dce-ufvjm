# Estágio 1: Build do Frontend (Next.js)
FROM node:20-slim AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Estágio 2: Backend (Django)
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# Instala dependências do sistema para o PostgreSQL
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copia e instala dependências do Python
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copia o código do backend
COPY backend/ ./

# Copia o build do frontend para que o Django possa servi-lo
# No settings.py, o Django busca em BASE_DIR / '../frontend/out'
COPY --from=frontend-builder /app/frontend/out /frontend/out

# Cria diretórios para estáticos e mídia
RUN mkdir -p /app/staticfiles /app/media

# Expõe a porta do Gunicorn
EXPOSE 8000

# O comando de inicialização será definido no docker-compose
