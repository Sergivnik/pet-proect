# Указываем версию Node
FROM node:14.17.0

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# 👇 Добавим поддержку архивных реп
RUN echo "deb http://archive.debian.org/debian stretch main" > /etc/apt/sources.list && \
    echo "Acquire::Check-Valid-Until \"false\";" > /etc/apt/apt.conf.d/99no-check-valid-until


# 🧱 Установим системные зависимости для Puppeteer
RUN apt-get update && apt-get install -y \
  libnss3 libxss1 libatk-bridge2.0-0 libgtk-3-0 libx11-xcb1 libasound2 \
  libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxrandr2 libxext6 libxfixes3 \
  fonts-liberation xdg-utils wget ca-certificates lsb-release \
  --no-install-recommends && \
  apt-get clean && rm -rf /var/lib/apt/lists/*

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь проект
COPY API ./API


# Открываем порт 80
EXPOSE 80

# Запускаем сервер
CMD ["node", "API/server.js"]

