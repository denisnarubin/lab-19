# Многоступенчатая сборка
FROM node:18-alpine AS builder

WORKDIR /app

# Копируем только файлы зависимостей сначала
COPY package*.json ./
COPY tsconfig*.json ./

# Устанавливаем все зависимости
RUN npm ci

# Копируем исходный код
COPY src/ ./src/

# Собираем приложение
RUN npm run build

# Продакшн образ
FROM node:18-alpine AS production

WORKDIR /app

# Копируем package.json
COPY package*.json ./

# Устанавливаем ТОЛЬКО production зависимости
RUN npm ci --only=production && npm cache clean --force

# Копируем скомпилированное приложение
COPY --from=builder /app/dist ./dist

# Создаем не-root пользователя
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 && \
    chown -R nestjs:nodejs /app

USER nestjs

EXPOSE 3000

CMD ["node", "dist/main.js"]