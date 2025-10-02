# Dockerfile para uma aplicação Next.js com múltiplos estágios

# Estágio 1: Dependências
# Instala as dependências necessárias para o build
FROM node:20-slim AS deps
WORKDIR /app

# Copia os arquivos de manifesto de pacotes
COPY package.json package-lock.json* ./

# Instala as dependências
RUN npm install

# Estágio 2: Build
# Compila a aplicação Next.js
FROM node:20-slim AS builder
WORKDIR /app

# Copia as dependências instaladas do estágio anterior
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Executa o script de build da aplicação
RUN npm run build

# Estágio 3: Runner
# Cria a imagem final e leve para execução
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copia os arquivos da compilação para a imagem final
# A instrução 'COPY --from=builder ...' agora lida com a ausência da pasta 'public'
COPY --from=builder /app/public* ./public 2>/dev/null || true
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

# O comando para iniciar a aplicação em produção
CMD ["npm", "start"]
