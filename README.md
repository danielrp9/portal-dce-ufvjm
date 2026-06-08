# Portal DCE UFVJM — Engenharia de Transparência e Gestão Estudantil

O **Portal DCE UFVJM** é uma plataforma integrada desenvolvida para ser o ponto central de informação e transparência do movimento estudantil, regido pelo DCE da UFVJM.

---

## Objetivo e Contextualização

Este projeto nasceu para solucionar a fragmentação da informação no movimento estudantil, centralizando editais, notícias, documentos oficiais e a movimentação financeira em um único lugar auditável e acessível.

---

## Guia de Execução

Existem duas formas principais de rodar o sistema: **Localmente (para desenvolvimento)** ou **Via Docker (preparado para produção)**.

### Opção 1: Execução Local (Modo Desenvolvedor)
Esta opção é ideal para desenvolvimento rápido. Por padrão, utiliza **SQLite** como banco de dados.

#### 1. Configurando o Backend
```bash
cd portal-dce-ufvjm/backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```
*Acesse em: `http://127.0.0.1:8000`*

#### 2. Configurando o Frontend
```bash
cd portal-dce-ufvjm/frontend
npm install
npm run dev
```
*Acesse em: `http://127.0.0.1:3000`*

---

### Opção 2: Execução com Docker (Modo Produção/Contêiner)
Esta é a forma recomendada para hospedagem em servidores da universidade. Ela utiliza **PostgreSQL** como banco de dados e o **Gunicorn** como servidor de aplicação.

#### Requisitos
- Docker e Docker Compose instalados.

#### Passo a Passo
1. **Prepare o ambiente:**
   Na raiz do projeto (`portal-dce-ufvjm/`), você encontrará o arquivo `docker-compose.yml` e o `Dockerfile`.

2. **Inicie os contêineres:**
   ```bash
   docker-compose up --build
   ```

3. **Configuração Inicial (Apenas na primeira vez):**
   O Docker já executa as migrações automaticamente, mas você precisará criar um administrador:
   ```bash
   docker exec -it dce_app python manage.py createsuperuser
   ```

*O sistema completo (Frontend servido pelo Django + Backend + Banco de Dados) estará disponível em: `http://localhost:8000`*

---

## Configuração para Produção (DNS e URLs)

Ao hospedar o sistema em um servidor da universidade com um domínio próprio (ex: `dce.ufvjm.edu.br`), você precisará ajustar algumas variáveis de ambiente no arquivo `docker-compose.yml` ou no ambiente do servidor:

### Variáveis Críticas de Backend (`backend/core/settings.py`)
- `ALLOWED_HOSTS`: Deve conter o domínio do servidor. Ex: `dce.ufvjm.edu.br`.
- `FRONTEND_URL`: A URL completa onde o usuário acessa o site. Ex: `https://dce.ufvjm.edu.br`.
- `CORS_ALLOWED_ORIGINS` e `CSRF_TRUSTED_ORIGINS`: Devem incluir o domínio de produção.
- `SECRET_KEY`: **Obrigatório** mudar para uma chave aleatória e segura em produção.
- `DEBUG`: Deve ser `False` em produção (o Docker Compose já define como False por padrão).

### Variáveis de Banco de Dados
- `DATABASE_URL`: No Docker, é montada automaticamente apontando para o serviço `db`. Se o banco de dados for externo, forneça a URL no formato: `postgres://usuario:senha@host:porta/nome_do_banco`.

### Variáveis de Frontend (`frontend/src/services/api.ts`)
- `NEXT_PUBLIC_API_URL`: 
  - Se o Django estiver servindo o frontend (comportamento padrão do Docker atual), deixe vazio ou como `/api/`.
  - Se o frontend estiver em um domínio diferente (ex: Vercel), coloque a URL do backend. Ex: `https://api-dce.ufvjm.edu.br/api/`.

---

## Mudanças no Código para Novos Domínios

Se você precisar mudar as rotas ou como o sistema se comporta em novos domínios, verifique os seguintes arquivos:

1.  **`portal-dce-ufvjm/backend/core/settings.py`**: Local onde se define quem pode acessar a API (`CORS`) e quais hosts o Django aceita.
2.  **`portal-dce-ufvjm/frontend/src/services/api.ts`**: Define para onde o frontend envia as requisições.
3.  **`portal-dce-ufvjm/frontend/next.config.ts`**: Se as imagens de produção vierem de um host específico, adicione-o em `remotePatterns`.

---

## Arquitetura no Docker
- **`dce_db`**: Contêiner PostgreSQL 15.
- **`dce_app`**: Contêiner Python que:
  1. Compila o frontend Next.js (`npm run build`).
  2. Coleta os arquivos estáticos (`collectstatic`).
  3. Executa as migrações do banco de dados.
  4. Serve a API e o Frontend via Gunicorn + WhiteNoise.

**Desenvolvido por Daniel Rodrigues Pereira**
