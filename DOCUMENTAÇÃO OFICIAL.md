# ConfereAI - Backend

O **ConfereAI** é um sistema de monitoramento e validação de presença baseado em **Reconhecimento Facial** e **Inteligência Artificial**, projetado para ambientes acadêmicos e corporativos. O objetivo é substituir métodos tradicionais de chamada por uma solução automatizada, segura e escalável, fornecendo métricas de engajamento e relatórios detalhados.

---

## Sumário

- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Como Executar o Projeto](#como-executar-o-projeto)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Endpoints da API](#endpoints-da-api)
- [Fluxo de Autenticação](#fluxo-de-autenticação)
- [Padrões de Código e Segurança](#padrões-de-código-e-segurança)
- [Roadmap](#roadmap)
- [Equipe](#equipe)
- [Sobre](#sobre)

---

## Funcionalidades

- **Registro automático de presença** via reconhecimento facial.
- **Detecção de engajamento** por expressões faciais e comportamento visual.
- **Dashboard** de relatórios de frequência e desempenho.
- **Autenticação JWT** e controle de acesso.
- **Compatibilidade** com dispositivos desktop e mobile.
- **Gestão de tokens** com Redis e Blacklist para segurança.
- **Logs e tratamento global de erros**.

---

## Tecnologias Utilizadas

- **Backend:** Node.js, Express.js
- **Banco de Dados:** PostgreSQL
- **Cache:** Redis
- **Visão Computacional/IA:** FaceIO, MediaPipe, face-api.js
- **Autenticação:** JWT, Passport.js
- **Infraestrutura:** Docker, APIs REST
- **CI/CD:** GitHub Actions
- **Outros:** UA-Parser-JS, dotenv, bcrypt

---

## Como Executar o Projeto

1. **Pré-requisitos:**
   - Node.js >= 18
   - PostgreSQL
   - Redis
   - Docker (opcional)

2. **Configuração do ambiente:**
   - Copie `.env.example` para `.env` e preencha as variáveis.

3. **Instalação das dependências:**
   ```bash
   npm install
   ```

4. **Execução do servidor:**
   ```bash
   npm run dev
   ```

5. **Acesso:**
   - O backend estará disponível em `http://localhost:<PORT>` (definido no `.env`).

---

## Estrutura do Projeto

```
src/
  auth/           # Serviços de autenticação e logout
  cache/          # Operações com Redis
  config/         # Configurações de banco, redis, passport
  controllers/    # Lógica dos endpoints
  middlewares/    # Middlewares globais e de autenticação
  queries/        # Consultas SQL (selects/inserts)
  routes/         # Rotas da API
  services/       # Regras de negócio
```

**Principais arquivos:**
- `app.js` - Inicialização do servidor Express e middlewares globais
- `.env.example` - Exemplo de variáveis de ambiente
- `package.json` - Dependências e scripts

---

## Endpoints da API

### Autenticação

- `POST /api/auth/sign-up`  
  Cadastro de usuário  
  **Body:** `{ "name": "string", "email": "string", "password": "string" }`

- `POST /api/auth/sign-in`  
  Login de usuário  
  **Body:** `{ "email": "string", "password": "string" }`  
  **Response:** `{ token, refreshToken, ... }`

- `POST /api/auth/logout`  
  Logout do usuário (necessário token de acesso)  
  **Body:** `{ "refreshToken": "string" }`

- `POST /api/auth/refresh`  
  Gera novo token de acesso a partir do refresh token  
  **Body:** `{ "userId": "string" }`

### Usuário

- `GET /api/usuarios/me`  
  Retorna perfil do usuário autenticado  
  **Headers:** `Authorization: Bearer <token>`

---

## Fluxo de Autenticação

1. **Cadastro:**  
   Usuário se cadastra via `/sign-up`. Dados são validados e senha é criptografada.

2. **Login:**  
   Usuário faz login via `/sign-in`. Se autenticado, recebe um JWT e um refresh token (armazenado no Redis).

3. **Acesso Protegido:**  
   Endpoints protegidos exigem o header `Authorization: Bearer <token>`. O middleware valida o JWT e verifica blacklist.

4. **Refresh Token:**  
   Quando o JWT expira, o usuário pode obter um novo token via `/refresh`, desde que o refresh token não esteja na blacklist.

5. **Logout:**  
   Ao deslogar, tokens são inseridos na blacklist (tabela e Redis), bloqueando seu uso futuro.

---

## Padrões de Código e Segurança

- **Senhas:** Armazenadas com hash bcrypt.
- **Tokens:** JWT assinado com segredo seguro, expiração curta e refresh token.
- **Blacklist:** Tokens revogados são bloqueados via tabela e Redis.
- **Validação:** Middlewares robustos para validação de entrada e autenticação.
- **Erros:** Tratamento global de erros e logs detalhados.
- **Variáveis Sensíveis:** Nunca commitadas, sempre via `.env`.

---

## Roadmap

- MVP: Registro de presença via reconhecimento facial.
- Integração com dashboards de frequência.
- Módulo de métricas de engajamento.
- Aplicação mobile (PWA ou nativa).
- Escalabilidade com arquitetura distribuída e microsserviços.

---

## Equipe

- Pesquisa e desenvolvimento em IA e Visão Computacional
- Backend e Banco de Dados
- Frontend e UX/UI
- Documentação e Infraestrutura

---

## Sobre

O **ConfereAI** é um projeto experimental desenvolvido inicialmente em contexto acadêmico, com foco em validação técnica e prototipagem rápida. A evolução do sistema considera aspectos de privacidade, segurança de dados e aplicação prática em ambientes reais.

---

## Exemplos de Requisição

### Cadastro

```http
POST /api/auth/sign-up
Content-Type: application/json

{
  "name": "João",
  "email": "joao@email.com",
  "password": "Senha@123"
}
```

### Login

```http
POST /api/auth/sign-in
Content-Type: application/json

{
  "email": "joao@email.com",
  "password": "Senha@123"
}
```

### Perfil do Usuário

```http
GET /api/usuarios/me
Authorization: Bearer <token>
```

---

## Observações

- **Banco de Dados:** Estrutura de tabelas esperada: `usuario`, `refreshtokens`, `refreshtokenblacklist`.
- **Redis:** Usado para armazenar refresh tokens por dispositivo.
- **Logs:** Todos os erros e operações críticas são logados no console.

---

**Dúvidas ou sugestões?**  
Abra uma issue ou entre em contato com a equipe de desenvolvimento.