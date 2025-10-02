# Dockerfile para uma aplicação Next.js

# 1. Estágio de Dependências
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# 2. Estágio de Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3. Estágio de Execução (Produção)
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Cria um usuário e grupo 'nextjs' para rodar a aplicação com privilégios reduzidos
RUN addgroup --system --gid 1001 nextjs
RUN adduser --system --uid 1001 nextjs

# Copia os arquivos da compilação para a imagem final
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts

# Muda para o usuário com menos privilégios
USER nextjs

# Expõe a porta que a aplicação Next.js irá rodar
EXPOSE 3000

# Define o comando para iniciar a aplicação
CMD ["npm", "start"]
