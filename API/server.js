const express = require("express");
const mysql2 = require("mysql2/promise");
const path = require("path");
const http = require("http"); // Для работы с socket.io
const socketIo = require("socket.io");
const router = require("./routers");
const config = require("./models/config.js");

const app = express();
const server = http.createServer(app); // Создаём HTTP сервер
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:8080", // Разрешённый клиентский домен
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
});

app.set("io", io);

// Подключение клиентов к WebSocket
io.on("connection", (socket) => {
  console.log("Клиент подключён:", socket.id);

  socket.on("disconnect", () => {
    console.log("Клиент отключился:", socket.id);
  });
});

// CORS для API
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080"); // Домен, с которого разрешены запросы
  res.header("Access-Control-Allow-Credentials", "true"); // Разрешаем передачу cookies и авторизационных заголовков
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  ); // Разрешаемые методы

  // Обрабатываем preflight-запрос (OPTIONS)
  if (req.method === "OPTIONS") {
    return res.sendStatus(204); // Успешный ответ без тела
  }

  next();
});

// Функция блокировки CORS нужна для режима разработки

app.use(express.static(path.join(__dirname, "./public")));
app.use(express.static(path.join(__dirname, "documents")));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));


const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const connection = mysql2.createPool(config.sql);
const sessionStore = new MySQLStore({}, connection);

let sessionOption = config.session;
sessionOption.store = sessionStore;
app.use(session(sessionOption));
app.use(router);

// Запускаем сервер
// var loadData = require("./DB/loadData");
// loadData.getData();
// loadData.getCities();
// loadData.getDrivers();
// loadData.getCustomers();
// loadData.getExpenses();
// loadData.getTrackDrivers();
server.listen(80, () => console.log("Сервер запущен на порту 80"));
