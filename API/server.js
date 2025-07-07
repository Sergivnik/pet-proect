require('dotenv').config();
const express = require('express');
const mysql2 = require('mysql2/promise');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const router = require('./routers');
const config = require('./models/config.js');
const os = require('os');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: [
      'http://localhost:8080',
      'http://atpivanova.ru',
      'http://5.44.41.196',
      'http://97356.zetalink.ru',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  },
});

app.set('io', io);

// ✅ Сначала объявляем переменные
const allowedOrigins = [
  'http://localhost:8080',
  'http://atpivanova.ru',
  'http://5.44.41.196',
  'http://97356.zetalink.ru',
];
const allowedReferers = [
  'http://localhost:8080',
  'http://atpivanova.ru',
  'http://5.44.41.196',
  'http://97356.zetalink.ru',
];

// 🛡️ Защита от некорректных URL и path traversal
app.use((req, res, next) => {
  try {
    const decodedPath = decodeURIComponent(req.path);
    if (decodedPath.includes('..')) {
      console.warn(`⛔️ Path traversal attempt: ${req.ip} -> ${req.url}`);
      return res.status(403).send('Forbidden');
    }
    next();
  } catch (err) {
    console.warn(`⛔️ Bad URI encoding attempt: ${req.ip} -> ${req.url}`);
    return res.status(400).send('Bad Request');
  }
});

// ✅ CORS и проверка Referer — объединено и оптимизировано
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const referer = req.headers.referer;

  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  }

  if (referer && !allowedReferers.some(r => referer.startsWith(r))) {
    console.warn(`❌ Запрос с недопустимого Referer: ${referer}`);
    return res.status(403).send('Access denied by Referer');
  }

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

// Подключение WebSocket
io.on('connection', socket => {
  console.log('Клиент подключён:', socket.id);

  socket.on('disconnect', () => {
    console.log('Клиент отключился:', socket.id);
  });
});

// Middleware
app.use(express.static(path.join(__dirname, './public')));
app.use(express.static(path.join(__dirname, 'documents')));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Сессии
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const connection = mysql2.createPool(config.sql);
const sessionStore = new MySQLStore({}, connection);
let sessionOption = config.session;
sessionOption.store = sessionStore;
app.use(session(sessionOption));

// Роутинг
app.use(router);

// Запуск сервера
server.listen(80, () => console.log('Сервер запущен на порту 80'));

setInterval(() => {
  const totalMem = os.totalmem() / 1024 / 1024;
  const freeMem = os.freemem() / 1024 / 1024;
  const usedMem = totalMem - freeMem;

  console.log('🧠 Использование системной памяти:');
  console.log(`- Всего     : ${totalMem.toFixed(2)} MB`);
  console.log(`- Занято    : ${usedMem.toFixed(2)} MB`);
  console.log(`- Свободно  : ${freeMem.toFixed(2)} MB`);
  console.log('—'.repeat(30));
}, 50000);
