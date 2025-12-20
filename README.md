# Extensao

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.12.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
# 🎓 Gabarita – Frontend

Aplicação web responsável pela interface do usuário do **Gabarita**, um sistema educacional focado na geração de quizzes do ENEM de forma dinâmica, utilizando IA.

O frontend consome a API do backend, permitindo que usuários **anônimos** realizem quizzes por matéria e assunto, com foco em simplicidade, performance e experiência do usuário.

🔗 Aplicação em produção:  
https://gabarita.netlify.app/navegacao

🔗 Backend (API):  
https://gabarita-backend.onrender.com/

---

## 🖥️ Visão Geral da Aplicação

Funcionalidades principais:

- Escolha de **matéria** e **assunto**
- Geração dinâmica de quizzes
- Resolução de questões em tempo real
- Feedback visual de acerto/erro
- Suporte a **usuário anônimo**
- Integração direta com backend em produção

---

## 🏗️ Arquitetura Frontend

Fluxo de funcionamento:

```
Usuário
   ↓
Angular (Frontend)
   ↓
Requisição HTTP (POST)
   ↓
API Gabarita (Backend no Render)
   ↓
Retorno do Quiz
   ↓
Renderização das Questões
```

---

## 🛠️ Tecnologias Utilizadas

- Angular 18
- TypeScript
- HTML5
- CSS3
- Angular Router
- Fetch API / HttpClient
- Netlify (Deploy)

---

## 📂 Estrutura do Projeto

```
GABARITA-FRONTEND
├── src
│   ├── app
│   │   ├── components
│   │   │   ├── quiz
│   │   │   ├── login
│   │   │   └── cadastro
│   │   ├── services
│   │   │   └── quiz.service.ts
│   │   ├── app.routes.ts
│   │   └── app.component.ts
│   ├── assets
│   └── environments
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔗 Integração com o Backend

Endpoint consumido pelo frontend:

```
POST https://gabarita-backend.onrender.com/api/quiz
```

### Exemplo de requisição:

```ts
const response = await fetch(
  'https://gabarita-backend.onrender.com/api/quiz',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      materia: 'Matemática',
      assunto: 'Funções'
    })
  }
);
```

---

## 👤 Usuários

### Usuário Anônimo

- Não requer login
- Pode gerar e responder quizzes
- Não possui persistência de score

### Preparado para Futuro Login

- Componentes de **login** e **cadastro** já criados
- Estrutura pronta para autenticação via backend
- Fácil extensão para JWT ou OAuth

---

## ▶️ Executando Localmente

1️⃣ Clone o repositório:

```bash
git clone https://github.com/seu-usuario/gabarita-frontend.git
```

2️⃣ Instale as dependências:

```bash
npm install
```

3️⃣ Inicie o servidor de desenvolvimento:

```bash
ng serve
```

Aplicação disponível em:

```
http://localhost:4200
```

---

## 🚀 Deploy

- Frontend hospedado no **Netlify**
- Build automático via Git
- Ambiente configurado para consumir API em produção

---

## 📌 Próximos Passos

- Autenticação de usuários
- Sistema de pontuação
- Histórico de quizzes
- Ranking
- Melhorias de UX/UI
- Responsividade avançada

---

## 🧑‍💻 Autor

Projeto desenvolvido por **João Guilherme** 🚀

---

## 📄 Licença

Projeto de uso educacional e experimental.
