# 🦋 Luna — Back-end Web

API REST do **Luna**, uma plataforma educacional desenvolvida para apoiar professores na gestão de turmas, alunos, atividades e planos de aula, considerando uma abordagem humanizada e inclusiva, com suporte à neurodiversidade.

O back-end é responsável pelo gerenciamento das regras de negócio, autenticação, validação de dados, persistência das informações e integração com serviços externos de armazenamento.

## 🚀 Tecnologias

| Tecnologia | Utilização |
|---|---|
| [Node.js](https://nodejs.org/) | Ambiente de execução JavaScript |
| [Express](https://expressjs.com/) | Construção da API REST |
| [MongoDB](https://www.mongodb.com/) | Banco de dados NoSQL |
| [Mongoose](https://mongoosejs.com/) | Modelagem e persistência de dados |
| [JWT](https://jwt.io/) | Autenticação e autorização |
| [Zod](https://zod.dev/) | Validação de dados de entrada |
| [Cloudinary](https://cloudinary.com/) | Armazenamento de arquivos e imagens |
| [Multer](https://github.com/expressjs/multer) | Processamento de uploads |
| [Bcrypt](https://www.npmjs.com/package/bcrypt) | Hash de senhas |
| [Docker](https://www.docker.com/) | Containerização da aplicação |
| [Nodemon](https://nodemon.io/) | Reinicialização automática durante o desenvolvimento |

## 📋 Funcionalidades

- **Autenticação:** login com JWT e controle de acesso por meio de middlewares.
- **Professores:** gerenciamento de contas e informações dos professores.
- **Turmas:** gerenciamento de turmas vinculadas ao professor autenticado.
- **Matérias:** cadastro e disponibilização das matérias utilizadas pela plataforma.
- **Planos de aula:** gerenciamento de planos de aula, com suporte a conteúdo manual e arquivos anexados.
- **Atividades:** gerenciamento de atividades vinculadas ao contexto educacional.
- **Upload de arquivos:** integração com Cloudinary para armazenamento de fotos, documentos e planos de aula.
- **Validação de dados:** aplicação de regras de negócio e validações com Zod.
- **Health Check:** endpoint para verificar a disponibilidade da API e a conexão com o MongoDB.
- **Seed:** script para inicialização das matérias básicas utilizadas pela plataforma.

## 🛠️ Arquitetura e organização

O projeto utiliza uma arquitetura organizada em camadas, separando responsabilidades entre rotas, controllers, services, models e middlewares.

- **Routes:** definição dos endpoints da API.
- **Controllers:** tratamento das requisições e respostas HTTP.
- **Services:** regras de negócio e operações sobre os dados.
- **Models:** definição dos schemas e modelos do MongoDB com Mongoose.
- **Middlewares:** autenticação, autorização, validação e processamento de uploads.
- **Config:** configurações de serviços externos, como Cloudinary.

## ⚙️ Configuração do ambiente

O Luna possui duas formas de execução, permitindo trabalhar com um banco de dados remoto durante o desenvolvimento e disponibilizar um ambiente local e isolado para testes.

### Pré-requisitos

- Node.js 24 ou superior para execução local.
- npm ou pnpm.
- Docker e Docker Compose para execução containerizada.
- Conta no MongoDB Atlas para desenvolvimento com banco remoto.
- Conta no Cloudinary para armazenamento de arquivos.

### 1. Clonar o repositório

```bash
git clone https://github.com/LunaSquad/Luna-web-Backend.git

cd Luna-web-Backend
```

### 2. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto, utilizando o `.env.example` como referência.

```env
PORT=4000
NODE_ENV=development

# MongoDB
DB_URL=

# JWT
JWT_SECRET=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Preencha as variáveis com suas próprias credenciais.

## 💻 Execução em desenvolvimento

Este modo é indicado para desenvolvimento e implementação de novas funcionalidades.

A aplicação utiliza as variáveis do `.env` e conecta diretamente ao MongoDB Atlas.

**Instalar as dependências:**

```bash
pnpm install
```

**Inicializar as matérias básicas:**

```bash
node scripts/seedMaterias.js
```

**Iniciar a aplicação:**

```bash
npm run dev
```

A API estará disponível em:

`http://localhost:4000`

Nesse ambiente, a aplicação utiliza o banco de dados definido em `DB_URL`, permitindo trabalhar diretamente com a instância remota do MongoDB.

## 🐳 Execução com Docker Compose

O projeto também disponibiliza um ambiente containerizado para facilitar a execução e os testes por outros desenvolvedores.

Nesse modo, não é necessário possuir uma conta no MongoDB Atlas. O Docker Compose inicializa automaticamente uma instância local do MongoDB e conecta a API a ela.

### 1. Configurar as variáveis de ambiente

Crie o arquivo `.env` a partir do `.env.example` e preencha:

- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Não é necessário preencher `DB_URL` para utilizar o ambiente Docker, pois o Compose define automaticamente o endereço do MongoDB local.

### 2. Construir e iniciar os containers

```bash
pnpm compose:up
```

O comando constrói a imagem da API e inicia os containers em segundo plano.

O Docker Compose será responsável por:

- Inicializar o MongoDB local.
- Verificar a disponibilidade do banco por meio de um health check.
- Aguardar o MongoDB ficar saudável antes de iniciar a API.
- Executar o script de seed das matérias.
- Iniciar o servidor Express.
- Disponibilizar a API na porta `4000`.

A API utiliza o MongoDB local do ambiente Docker, enquanto os uploads continuam sendo armazenados no Cloudinary.

### 3. Executar seed de demonstração (Opcional)

Além do seed automático das matérias básicas, o projeto disponibiliza um seed de desenvolvimento com dados fictícios para facilitar os testes da API.

Após iniciar os containers, execute:

```bash
pnpm compose:seed
```

Esse comando executa o script `scripts/seedDev.js` dentro do container da API, populando o MongoDB local com dados de demonstração, incluindo:

- Professores e usuários de teste.
- Turmas e alunos.
- Matérias.
- Planos de aula.
- Atividades geradas pela IA e respostas de alunos.

Ao finalizar, o script apresenta as credenciais das contas de demonstração disponíveis para acessar e testar a API pelo Swagger.

**Observações:**
- A execução é opcional.
- O container da API precisa estar em execução.
- Os dados são inseridos no MongoDB local do Docker.
- O seed não substitui o seed automático das matérias básicas.

### 4. Verificar os containers

```bash
docker compose ps
```

### 5. Consultar os logs

```bash
pnpm compose:logs
```

### 6. Encerrar o ambiente

```bash
pnpm compose:down
```

Os dados do MongoDB são persistidos em um volume Docker, portanto continuam disponíveis após encerrar os containers.

Para remover também os dados persistidos e reiniciar o banco do zero:

```bash
docker compose down -v
```

### ☁️ Cloudinary no ambiente Docker

O armazenamento de arquivos utiliza o Cloudinary independentemente do ambiente de execução.

Cada desenvolvedor deve utilizar suas próprias credenciais, configuradas no `.env` local. O Docker Compose repassa essas variáveis para o container da API sem armazenar chaves privadas diretamente no arquivo YAML.

## 🔗 Principais endpoints

| Método | Rota | Descrição |
|---|---|---|
| GET | `/health` | Verifica a disponibilidade da API e a conexão com o banco |
| POST | `/login` | Autenticação e geração do token JWT |
| `/professores` | Professores | Rotas de gerenciamento do corpo docente |
| `/materias` | Matérias | Rotas de consulta e gerenciamento das matérias |
| `/turmas` | Turmas | Rotas de gerenciamento das turmas |
| `/planos-de-aula` | Planos de aula | Rotas de gerenciamento dos planos de aula |
| `/atividades` | Atividades | Rotas de gerenciamento das atividades |

Os métodos HTTP disponíveis e os requisitos de autenticação são definidos individualmente nos arquivos de rotas e seus respectivos middlewares.

### Autenticação

As rotas protegidas utilizam autenticação baseada em JWT.

Após realizar o login, o token retornado deve ser enviado nas requisições protegidas por meio do header:

```http
Authorization: Bearer SEU_TOKEN_JWT
```

O controle de acesso utiliza a identidade do professor autenticado, obtida a partir do token, para restringir as operações aos recursos autorizados.

### Health Check

O endpoint `GET /health` permite verificar se a API está respondendo e se a conexão com o MongoDB está estabelecida.

Exemplo de resposta:

```json
{
  "status": "ok",
  "timestamp": "2026-11-02T17:55:12.000Z",
  "services": {
    "api": "ok",
    "database": "connected"
  }
}
```

Quando a conexão com o banco não está disponível, o endpoint retorna HTTP `503 Service Unavailable`.

## 📁 Estrutura do projeto

```text
Luna-Backend/
│
├── src/
│   ├── config/
│   │   └── cloudinary.js
│   │
│   ├── controllers/
│   ├── middlewares/
│   │   └── upload-imagem.js
│   │
│   ├── models/
│   ├── routes/
│   ├── services/
│   │
│   └── index.js
│
├── scripts/
│   └── seedMaterias.js
│
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

## 👥 Equipe

**Luminous**

Projeto desenvolvido como parte do Projeto Integrador, com foco no desenvolvimento de uma solução educacional inclusiva e no apoio à gestão pedagógica.

---

**Luna — Tecnologia a serviço de uma educação mais inclusiva.**