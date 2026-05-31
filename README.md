# Portal DCE UFVJM — Engenharia de Transparência e Gestão Estudantil

O **Portal DCE UFVJM** é uma plataforma integrada desenvolvida para ser o ponto central de informação e transparência  do movimento estudantil, regido pelo DCE da UFVJM. 

---

## Objetivo e Contextualização

Este projeto nasceu para solucionar um problema histórico: a **fragmentação da informação**. Até então, editais, notícias urgentes, documentos oficiais e, principalmente, a movimentação financeira das gestões do DCE ficavam espalhados em redes sociais, grupos de mensagens ou arquivos físicos de difícil acesso.

**O que o projeto busca solucionar:**
*   **Unificação do Movimento:** Centraliza todas as questões do movimento estudantil em um único lugar, servindo como a "memória viva" das lutas e conquistas.
*   **Transparência Radical:** Garante que qualquer estudante possa auditar os processos realizados pelas gestões, desde a publicação de uma ata de reunião até o balanço detalhado de entradas e saídas do caixa.
*   **Democratização da Informação:** Transforma dados técnicos e burocráticos em interfaces amigáveis, permitindo que a base estudantil compreenda como os recursos são aplicados e como os processos administrativos são conduzidos.

---

## Guia de Execução (Clonagem e Instalação)

Para garantir que o projeto execute sem erros, siga rigorosamente os passos abaixo. Este sistema utiliza uma arquitetura desacoplada com **Django** no backend e **Next.js** no frontend.

### 1. Clonando o Repositório
```bash
git clone https://github.com/seu-usuario/dce-portal.git
cd dce-portal
```

### 2. Configurando o Backend (Cérebro)
É fundamental usar um ambiente virtual para isolar as dependências do Python.
```bash
# Entre na pasta do backend
cd portal-dce-ufvjm/backend

# Crie e ative o ambiente virtual
python -m venv venv
source venv/bin/activate  # No Linux/Mac
# No Windows: venv\Scripts\activate

# Instale as dependências
pip install -r requirements.txt

# Execute as migrações para criar as tabelas no banco de dados
python manage.py migrate

# Crie seu usuário de administrador (para acessar o /admin)
python manage.py createsuperuser

# Inicie o servidor do Django
python manage.py runserver
```
*O backend estará rodando em: `http://127.0.0.1:8000`*

### 3. Configurando o Frontend (Interface)
Certifique-se de ter o **Node.js** instalado (recomenda-se v18 ou superior).
```bash
# Em um novo terminal, entre na pasta do frontend
cd portal-dce-ufvjm/frontend

# Instale as dependências do Node
npm install

# Inicie o servidor de desenvolvimento do Next.js
npm run dev
```
*O frontend estará rodando em: `http://127.0.0.1:3000`*

---

## Filosofia de Arquitetura

Optei por uma arquitetura **Headless (Decoupled)**, separando completamente a lógica de dados da interface visual:

*   **Django 5.x & DRF:** Escolhido pela maturidade em permissões e integridade de dados. O sistema é modularizado em apps independentes (`noticias`, `financeiro`, `editais`,`eventos`,`artigos`,), o que garante que uma falha em um módulo não afete os outros.
*   **Next.js 16 & React 19:** Focado em SEO e Performance. Utiliza *Server Components* para garantir que editais e notícias sejam indexados instantaneamente pelo Google, sendo acessíveis mesmo em conexões de internet instáveis.

---

## Engenharia de Transparência

O módulo `financeiro` é o coração da transparência do portal. Ele utiliza um sistema de **Exercícios Financeiros**, onde cada transação é selada e auditável. Os saldos não são estáticos; são calculados em tempo real via agregations do Django, garantindo que o portal da transparência reflita exatamente a realidade do caixa.

---

## Deployment

O sistema está preparado para deploy *stateless*. Os arquivos estáticos são servidos via **WhiteNoise** e a aplicação pode ser facilmente hospedada em plataformas como Vercel (frontend) e Railway/Render (backend).

---

**Desenvolvido por Daniel Rodrigues Pereira**  
