# 📑 README.md

# Portal DCE UFVJM — Sistema de Gestão e Transparência Estudantil

Este é o repositório oficial do novo **Portal do Diretório Central dos Estudantes (DCE) da UFVJM**. O projeto une uma estética de **Editorial de Jornal Clássico** com uma arquitetura moderna, escalável e de alta disponibilidade, focada em fornecer informações oficiais, editais e transparência financeira para a comunidade discente.

---

## 🏛️ Arquitetura Técnica

O sistema foi desenvolvido utilizando o paradigma **Headless**, garantindo o desacoplamento total entre a lógica de negócios e a interface do usuário. Essa escolha arquitetural permite escalabilidade independente e facilita manutenções futuras.

* **Backend (Core):** Construído com **Django 5.x** e **Django REST Framework (DRF)**. Atua como um serviço de API centralizado que gerencia o estado da aplicação, autenticação administrativa e persistência de dados.
* **Frontend (Interface):** Desenvolvido em **Next.js 16** utilizando o **App Router** e **React 19**. Focado em performance, SEO e renderização híbrida (Server-Side Rendering para notícias e Client-Side Rendering para filtros financeiros).
* **Estilização:** Utiliza **Tailwind CSS v4** com o plugin `@tailwindcss/typography` para garantir a fidelidade estética ao estilo editorial clássico proposto.
* **Gestão de Dados:** Implementado com **PostgreSQL** em ambiente de produção para segurança transacional e **SQLite** para agilidade em desenvolvimento.
* **Servidor de Aplicação:** Preparado para **Gunicorn (WSGI)**, otimizando a execução de processos Python em ambiente servido.

---

## 🚀 Funcionalidades Principais

-   **📰 Gestão Editorial:** Sistema de notícias com suporte a Rich Text (CKEditor) e slugs amigáveis.
-   **📂 Repositório Digital Dinâmico:** Organização de documentos e editais com sistema automático de destaque para a publicação mais recente.
-   **📅 Agenda Acadêmica:** Calendário centralizado de eventos, palestras e mobilizações estudantis.
-   **💰 Portal da Transparência:** Livro-caixa digital com balanço patrimonial automático, saldo consolidado e controle por exercício financeiro.
-   **📱 Interface Adaptativa:** Design otimizado para Desktop (foco em leitura longa) e Mobile (foco em usabilidade rápida com menu lateral *Drawer*).

---

## 🔧 Guia de Instalação e Execução

### Pré-requisitos
- Python 3.10+
- Node.js 20+
- PostgreSQL (Recomendado para produção)

### 1. Configurando o Backend (Django)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```
O backend estará operando em `http://127.0.0.1:8000`.

### 2. Configurando o Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
O frontend estará operando em `http://localhost:3000`.

---

## 🌐 Variáveis de Ambiente (.env)

Para o correto funcionamento em produção, configure:

**Frontend (`.env.local`):**
- `NEXT_PUBLIC_API_URL`: URL base da API Django.

**Backend (`settings.py` / `.env`):**
- `DEBUG`: `False`
- `FRONTEND_URL`: URL final do site Next.js (para redirecionamento do Admin).
- `ALLOWED_HOSTS`: Domínios autorizados.
- `CORS_ALLOWED_ORIGINS`: Origem do frontend para permissão de requisições.

---

## 📂 Organização do Repositório

```text
.
├── backend/                # Lógica de negócio e API REST
│   ├── core/               # Configurações do projeto Django
│   ├── dce_portal/         # App principal (Models, Serializers, Views)
│   ├── media/              # Armazenamento de uploads (Imagens/PDFs)
│   └── requirements.txt    # Dependências de produção (inclui Gunicorn e Psycopg2)
├── frontend/               # Interface do usuário (SPA/SSR)
│   ├── src/app/            # Estrutura de rotas Next.js App Router
│   ├── src/components/     # Biblioteca de UI Components padronizados
│   ├── src/services/       # Integração via Axios
│   └── package.json        # Scripts de build e dependências (Next 16+)
└── README.md               # Documentação do projeto
```

---

## ✍️ Desenvolvedor

Projeto concebido e desenvolvido para o **DCE UFVJM - Gestão "O Futuro é Agora"**.

* **Desenvolvedor:** Daniel Rodrigues Pereira
* **Linkedin:** [daniel-rodrigues-pereira](https://www.linkedin.com/in/daniel-rodrigues-pereira-29b1b7243/)
* **E-mail:** danielrodrigues878@hotmail.com
* **GitHub:** [@danielrp9](https://github.com/danielrp9)
