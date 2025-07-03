# Базовый образ
FROM node:14.17.0

# Рабочая директория
WORKDIR /usr/src/app

# Копируем package.json
COPY package*.json ./

# Установка зависимостей
RUN npm install

# Копируем остальные файлы
COPY . .

# Открываем порты
EXPOSE 3000 5000

# Используем многопроцессовый запуск через concurrently
RUN npm install -g concurrently

CMD concurrently "npm run dev" "node API/server.js"
