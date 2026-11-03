# ==============================================================================
# Estágio 1: Instalação de Dependências de Produção
# ==============================================================================
FROM node:24-alpine AS deps

WORKDIR /app

# Instala o pnpm globalmente
RUN npm install -g pnpm@latest

# Desativa a restrição de build de dependências nativas (como bcrypt)
RUN pnpm config set strict-dep-builds false

# Copia os manifestos de dependências
COPY package.json pnpm-lock.yaml* ./

# Instala apenas as dependências de produção
RUN pnpm install --prod --frozen-lockfile

# ==============================================================================
# Estágio 2: Imagem Final de Execução (Produção enxuta)
# ==============================================================================
FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

# Cria usuário sem privilégios de root para segurança
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

# Copia dependências e código-fonte
COPY --from=deps /app/package.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY src ./src
COPY scripts ./scripts

USER nodejs

EXPOSE 4000

CMD ["node", "src/index.js"]