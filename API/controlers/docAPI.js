var tasksDoc = require('../models/taskDocs.js');
const { getSharedBrowser } = require('../puppeteerSharedBrowser.js');
var fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { log } = require('console');
const writeFileAsync = promisify(fs.writeFile);
const existsAsync = promisify(fs.exists);
const writeLogToFile = logData => {
  const logFilePath = './API/Bills/logfile.txt'; // Путь к файлу логов
  const logString = `[${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}] ${logData}\n`;

  fs.appendFile(logFilePath, logString, err => {
    if (err) {
      console.error('Ошибка при записи лога:', err);
    }
  });
};

const callBack = (data, res) => {
  if (data.error) {
    console.log(data);
    writeLogToFile(data);
    res.status(500);
    res.json({ message: data.error });
  } else {
    res.json(data);
  }
};

// ---------Очередь создания pdf-файлов---------//
const MAX_CONCURRENT = 10; // ← Меняй это число для лимита
let activeCount = 0;
const queue = [];

async function enqueueTask(taskFn) {
  return new Promise((resolve, reject) => {
    queue.push({ taskFn, resolve, reject });
    processQueue();
  });
}

async function processQueue() {
  if (activeCount >= MAX_CONCURRENT || queue.length === 0) return;

  const { taskFn, resolve, reject } = queue.shift();
  activeCount++;

  taskFn()
    .then(result => resolve(result))
    .catch(err => reject(err))
    .finally(() => {
      console.log(
        `Активных задач: ${activeCount}, Память:`,
        process.memoryUsage().rss / 1024 / 1024,
        'MB'
      );
      activeCount--;
      processQueue(); // запускаем следующую задачу
    });
}
// ---------Очередь создания pdf-файлов---------//

module.exports.taskCreateContract = (req, res) => {
  res.set('Access-Control-Allow-Credentials', 'true');
  console.log('hi', req.sessionID, req.body);
  tasksDoc.createContract(req.body.customer, req.body.html, req.body.css, data =>
    callBack(data, res)
  );
};
module.exports.taskCreateDriverContract = (req, res) => {
  res.set('Access-Control-Allow-Credentials', 'true');
  console.log('hi', req.sessionID, req.body);
  tasksDoc.createDriverContract(req.body.driver, req.body.html, req.body.css, data =>
    callBack(data, res)
  );
};
module.exports.taskGetPdfContract = (req, res) => {
  res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  // Check if user is authenticated
  if (!req.session.userId) {
    console.log(req.session.userId);

    return res.status(401).json({ message: 'Unauthorized - Please login first' });
  }

  const { customer } = req.query;
  console.log(customer);
  const path = require('path');
  let pathBills = path.join(__dirname, '..', `contracts/${customer}`);
  res.sendFile(`${pathBills}/contract.pdf`);
};
module.exports.createAccountingDoc = async (req, res) => {
  res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  const { html, billNumber, year, customer, currentTable, orderId, stamp, typeDoc } = req.body;
  console.log(billNumber, year, customer, currentTable, orderId, stamp, typeDoc);

  let dirPath, filePath;
  if (currentTable === 'oderslist') {
    dirPath = `./API/Bills/${year}/${customer}`;
    if (typeDoc === 'Bill') filePath = `${dirPath}/doc${billNumber}.pdf`;
    if (typeDoc === 'BillNoStamp') filePath = `${dirPath}/docWithoutStamp${billNumber}.pdf`;
    if (typeDoc === 'Invoice' && stamp) filePath = `${dirPath}/invoice${billNumber}.pdf`;
    if (typeDoc === 'Invoice' && !stamp) filePath = `${dirPath}/invoiceNoSeal${billNumber}.pdf`;
  }
  if (currentTable === 'driverorderlist') {
    dirPath = `./API/DriverBills/${year}/${customer}`;
    if (typeDoc === 'Bill') filePath = `${dirPath}/doc${billNumber}.pdf`;
    if (typeDoc === 'BillNoStamp') filePath = `${dirPath}/docWithoutStamp${billNumber}.pdf`;
    if (typeDoc === 'Invoice' && stamp) filePath = `${dirPath}/invoice${billNumber}.pdf`;
    if (typeDoc === 'Invoice' && !stamp) filePath = `${dirPath}/invoiceNoSeal${billNumber}.pdf`;
  }
  if (!filePath || !dirPath) {
    return res.status(400).json({ message: 'Неверные параметры документа' });
  }

  res.status(202).json({ ok: true, message: 'PDF поставлен в очередь' });

  void enqueueTask(async () => {
    let page;
    try {
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      const browser = await getSharedBrowser();
      page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0', timeout: 60000 });
      await page.pdf({
        path: filePath,
        format: 'a4',
        timeout: 0,
        printBackground: true,
        margin: {
          top: '5mm',
          right: '10mm',
          bottom: '5mm',
          left: '5mm',
        },
      });
      console.log('PDF создан');

      if (typeDoc === 'Bill') {
        tasksDoc.add([orderId], billNumber, currentTable, data => {
          if (data.error) {
            console.error('tasksDoc.add:', data.error);
            writeLogToFile(String(data.error));
            return;
          }
          console.log('socket.io');
          req.app.get('io').emit('createBillNew', { orderId, currentTable, billNumber, typeDoc });
        });
      } else {
        req.app.get('io').emit('createBillNew', { orderId, currentTable, billNumber, typeDoc });
      }
    } catch (error) {
      console.error('Ошибка при создании PDF:', error);
      writeLogToFile(String(error && error.message ? error.message : error));
    } finally {
      if (page) {
        try {
          await page.close();
        } catch (closeErr) {
          console.error('Ошибка при закрытии страницы:', closeErr);
        }
      }
    }
  }).catch(err => console.error('Очередь createAccountingDoc:', err));
};
module.exports.taskCreatePdfDocNew = async (req, res) => {
  res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  console.log(req.body.id, req.body.typeDoc, req.file);

  const typeDoc = req.body.typeDoc;
  const id = req.body.id;
  const file = req.file;
  const permission = req.body.permission;
  let fileName = '';
  let filePath = '';

  if (typeDoc == 'customerContract') {
    const data = await tasksDoc.getDataFromTableByIdAsyhc(id, 'oders');
    if (data.error) {
      res.status(500).json({ message: data.error });
      return;
    }
    console.log(data.value);
    let customerName = data.value;
    fileName = 'contract.pdf';
    filePath = path.join(__dirname, `../contracts/${customerName}`, fileName);
  }
  if (typeDoc == 'ttn') {
    let data = await tasksDoc.getDataFromTableByIdAsyhc(id, 'oderslist');
    let customerId = data.idCustomer;
    let date = new Date(data.date);
    let year = date.getFullYear();
    let accountNumber = data.accountNumber;
    data = await tasksDoc.getDataFromTableByIdAsyhc(customerId, 'oders');
    let customerName = data.value;
    if (!isNaN(Number(accountNumber))) {
      fileName = `ttn${Number(accountNumber)}.pdf`;
    } else {
      fileName = `ttn${accountNumber}.pdf`;
    }
    filePath = path.join(__dirname, `../Bills/${year}/${customerName}`, fileName);
  }
  if (typeDoc == 'app') {
    let data = await tasksDoc.getDataFromTableByIdAsyhc(id, 'oderslist');
    let customerId = data.idCustomer;
    let date = new Date(data.date);
    let year = date.getFullYear();
    data = await tasksDoc.getDataFromTableByIdAsyhc(customerId, 'oders');
    let customerName = data.value;
    fileName = `app${id}.pdf`;
    filePath = path.join(__dirname, `../Bills/${year}/${customerName}/app`, fileName);
  }
  if (typeDoc == 'owner') {
    let data = await tasksDoc.getDataFromTableByIdAsyhc(id, 'drivers');
    let owner = data.value;
    fileName = `docOwner.pdf`;
    filePath = path.join(__dirname, `../docs/${owner}`, fileName);
  }
  if (typeDoc == 'driver') {
    let data = await tasksDoc.getDataFromTableByIdAsyhc(id, 'trackdrivers');
    let ownerId = data.idOwner;
    let driverName = data.name;
    data = await tasksDoc.getDataFromTableByIdAsyhc(ownerId, 'drivers');
    let owner = data.value;
    fileName = `docDriver.pdf`;
    filePath = path.join(__dirname, `../docs/${owner}/${driverName}`, fileName);
  }
  if (typeDoc == 'track') {
    let data = await tasksDoc.getDataFromTableByIdAsyhc(id, 'tracklist');
    let ownerId = data.idOwner;
    let trackNumber = data.value;
    data = await tasksDoc.getDataFromTableByIdAsyhc(ownerId, 'drivers');
    let owner = data.value;
    fileName = `docTrack.pdf`;
    filePath = path.join(__dirname, `../docs/${owner}/${trackNumber}`, fileName);
  }
  if (typeDoc == 'contractor') {
    let data = await tasksDoc.getDataFromTableByIdAsyhc(id, 'contractorspayments');
    console.log(data);
    let idContractor = data.idContractor;
    let contractorData = await tasksDoc.getDataFromTableByIdAsyhc(idContractor, 'contractors');
    let contractor = contractorData.value;
    let date = new Date(data.date);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let strDate = `${year}-${month}-${day}`;
    fileName = `check ${strDate}`;
    filePath = path.join(__dirname, `../contractors/${contractor}`, fileName);
  }

  try {
    const directoryExists = await existsAsync(path.dirname(filePath));

    if (!directoryExists) {
      console.log('Directory does not exist, creating...');
      // Создаем каталог, если его нет
      await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
    }
    try {
      const stats = await fs.promises.stat(filePath);
      if (stats.isFile()) {
        // Файл существует
        console.log('File exists:', filePath);

        if (permission == 'true') {
          fs.writeFile(filePath, file.buffer, err => {
            if (err) {
              console.error('Error saving file:', err);
              res.status(500).send('Error saving file');
            } else {
              console.log('File saved:', fileName);
              // Отправляем успешный ответ клиенту
              res.status(200).send('File saved successfully');
            }
          });
        } else {
          console.log("File didn't saved. Need permission");
          res.status(200).send('File exist');
        }
      }
    } catch {
      // Записываем данные файла на сервер
      fs.writeFile(filePath, file.buffer, err => {
        if (err) {
          console.error('Error saving file:', err);
          res.status(500).send('Error saving file');
        } else {
          console.log('File saved:', fileName);
          // Отправляем успешный ответ клиенту
          res.status(200).send('File saved successfully');
        }
      });
    }
  } catch (error) {
    console.error('Error saving file:', error);
    res.status(500).send('Error saving file');
  }
};
