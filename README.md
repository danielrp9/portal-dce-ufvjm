# Portal DCE UFVJM — Engenharia de Transparência e Gestão Estudantil

Este projeto não é apenas um site; é uma infraestrutura pensada para resolver a fragmentação de informações no ecossistema estudantil da UFVJM. Desenvolvi este portal com o objetivo de unir o rigor técnico necessário para a transparência financeira com a agilidade de um editorial de notícias moderno.

---

## 🏗️ Filosofia de Arquitetura

Optei por uma arquitetura **Headless (Decoupled)**, separando completamente o cérebro (Django) da pele (Next.js). Essa decisão não foi estética, mas estratégica:

### 1. O "Cérebro" com Django 5.x & DRF
Escolhi o Django pela sua maturidade em lidar com permissões e integridade de dados. Em um portal de um DCE, onde múltiplos gestores podem editar conteúdos, o sistema de `admin` nativo e os `soft-constraints` do ORM me permitiram focar no domínio do problema em vez de reinventar a roda de autenticação e segurança.
*   **Modularidade Granular:** Em vez de uma aplicação gigante, fragmentei o backend em apps independentes (`noticias`, `financeiro`, `editais`). Isso isola falhas: se a lógica de cálculo financeiro precisar mudar, o motor de notícias permanece intacto.
*   **Rich Text Control:** Integrei o CKEditor para que a gestão editorial tenha liberdade criativa, mas com filtros de sanitização rigorosos no backend para evitar XSS e quebras de layout no frontend.

### 2. A "Pele" com Next.js 16 & React 19
No frontend, a prioridade absoluta foi **SEO e Performance**. Um edital de bolsa ou uma notícia urgente precisa ser indexada pelo Google instantaneamente e carregar rápido em conexões móveis instáveis.
*   **Hybrid Rendering:** Utilizo *Server Components* para o conteúdo pesado (notícias, documentos) para garantir que o HTML chegue pronto ao navegador, e *Client-Side Rendering* apenas onde a interatividade é necessária, como nos filtros dinâmicos do portal da transparência.
*   **Tailwind CSS 4 + Typography:** A estética "Editorial Clássico" exige controle fino sobre escalas tipográficas. O uso do plugin `@tailwindcss/typography` me permitiu focar na legibilidade do texto, tratando o conteúdo vindo do backend com o respeito visual que a informação oficial merece.

---

## 💰 Engenharia de Transparência (O Diferencial)

O módulo `financeiro` foi o maior desafio técnico. Ele não é apenas um CRUD de entradas e saídas. Implementei um sistema de **Exercícios Financeiros**, onde cada transação está vinculada a um período fiscal. 
*   **Cálculos em Voo:** O saldo consolidado e o balanço patrimonial não são campos estáticos no banco (o que geraria inconsistência), mas sim calculados via aggregations do Django no momento da requisição, garantindo que o valor exibido seja sempre a verdade absoluta dos dados.

---

## 🛠️ Guia de Execução Detalhado

Para rodar este sistema, você precisa garantir que o "diálogo" entre o backend e o frontend esteja configurado via variáveis de ambiente.

### Passo 1: O Engine (Backend)
Primeiro, isolamos o ambiente para evitar conflitos de bibliotecas.
```bash
cd backend
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate

# Instalação das dependências e drivers do banco
pip install -r requirements.txt

# Preparação do Banco de Dados
# O sistema detecta automaticamente se deve usar SQLite (dev) ou PostgreSQL (prod) via DATABASE_URL
python manage.py migrate
python manage.py createsuperuser  # Crie seu acesso administrativo
python manage.py runserver
```

### Passo 2: A Interface (Frontend)
Em um terminal separado, subimos o Next.js.
```bash
cd frontend
npm install

# Execução em ambiente de desenvolvimento
# Configure o .env.local com NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
npm run dev
```

*Dica de Engenharia:* Configurei um script `npm run dev` no `package.json` do frontend que utiliza `concurrently` para subir ambos os servidores se você estiver em um ambiente que suporte execução paralela (requer ajuste de caminhos no script).

---

## 📂 Anatomia do Projeto

*   **`backend/core/`**: Onde reside o "sistema operacional" do projeto (middlewares de segurança, configurações de CORS e WhiteNoise).
*   **`backend/financeiro/`**: Lógica de balanço patrimonial e controle de fluxo de caixa.
*   **`frontend/src/app/`**: Estrutura de rotas utilizando o novo paradigma do App Router, otimizado para layouts aninhados.
*   **`frontend/src/services/`**: Camada de abstração para consumo da API, centralizando o tratamento de erros e interceptores do Axios.

---

## 📡 Deployment e Escalabilidade

O sistema foi preparado para ser *stateless*. Os uploads (`media/`) devem ser integrados a um bucket S3 em produção, e os arquivos estáticos são servidos via **WhiteNoise** com compressão Brotli/Gzip, o que elimina a necessidade de um Nginx complexo para deploys rápidos em plataformas como Railway, Heroku ou Vercel.

---

**Desenvolvido por Daniel Rodrigues Pereira**  
*Engenheiro focado em criar soluções que resolvam problemas reais com código limpo e decisões justificadas.*
