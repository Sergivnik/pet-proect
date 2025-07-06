# Указываем версию Node
FROM node:14.17.0

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

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

