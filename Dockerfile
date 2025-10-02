# Estágio de Dependências
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

# Estágio de Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Estágio de Execução
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copia o usuário 'nextjs' com o UID e GID corretos da imagem do builder.
COPY --from=builder /etc/passwd /etc/passwd
COPY --from=builder /etc/group /etc/group

# Define o usuário para 'nextjs' para maior segurança.
USER nextjs

# Copia os arquivos da compilação para a imagem final
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
