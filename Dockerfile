# 1. Базовый образ Node 22
FROM node:22-alpine

# 2. Системные зависимости для Puppeteer / Chromium
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    bash \
    curl \
    alsa-lib \
    libx11 \
    libxcomposite \
    libxrandr \
    libxdamage \
    libxfixes \
    libxext \
    libxcursor \
    && rm -rf /var/cache/apk/*

# 3. Настраиваем Puppeteer
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    NODE_ENV=production

# 4. Создаем рабочую директорию
WORKDIR /app

# 5. Копируем package.json и package-lock.json (если есть)
COPY package*.json ./

# 6. Устанавливаем зависимости
RUN npm install

# 7. Копируем весь код проекта
COPY . .

# 8. Открываем порт
EXPOSE 80

# 9. Старт приложения
CMD ["node", "API/server.js"]
