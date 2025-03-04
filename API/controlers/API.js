var tasks = require("../models/tasks.js");
var tasksDoc = require("../models/taskDocs.js");
var tasksPayments = require("../models/tasksPayments.js");
var tasksDebt = require("../models/tasksDriverDebts.js");
var taskPaymentsDriver = require("../models/taskPaymentsDriver.js");
var taskContractors = require("../models/taskContractor.js");
var tasksData = require("../models/tasksData.js");
var tacksDocs = require("../models/taskDocs.js");
var taskReports = require("../models/taskReports.js");
var tasksAddData = require("../models/tasksAddData.js");
var tasksUser = require("../models/taskUser.js");
const puppeteer = require("puppeteer");
var fs = require("fs");

const writeLogToFile = (logData) => {
  const logFilePath = "./API/Bills/logfile.txt"; // Путь к файлу логов
  const logString = `[${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}] ${logData}\n`;

  fs.appendFile(logFilePath, logString, (err) => {
    if (err) {
      console.error("Ошибка при записи лога:", err);
    }
  });
};

module.exports.taskGet = (req, res) => {
  tasks.list((data) => {
    if (data.error) {
      res.status(500);
      res.json({ message: data.error });
    } else {
      res.json(data);
    }
  });
};
module.exports.taskGet5000 = (req, res) => {
  console.log("req");
  tasks.order5000((data) => {
    if (data.error) {
      res.status(500);
      res.json({ message: data.error });
    } else {
      res.json(data);
    }
  });
};
module.exports.taskGetPayments = (req, res) => {
  tasksPayments.list((data) => {
    if (data.error) {
      res.status(500);
      res.json({ message: data.error });
    } else {
      res.json(data);
    }
  });
};
module.exports.taskGetDebts = (req, res) => {
  tasksDebt.list((data) => {
    if (data.error) {
      res.status(500);
      res.json({ message: data.error });
    } else {
      res.json(data);
    }
  });
};
module.exports.taskGetContractors = (req, res) => {
  taskContractors.list((data) => {
    if (data.error) {
      res.status(500);
      res.json({ message: data.error });
    } else {
      res.json(data);
    }
  });
};

module.exports.taskGetFilter = (req, res) => {
  console.log(req.body.body);
  tasks.filter(req.body.body, (data) => {
    if (data.error) {
      res.status(500);
      res.json({ message: data.error });
    } else {
      res.json(data);
    }
  });
};
module.exports.taskGetReport = (req, res) => {
  taskReports.reconciliation(req.body.body, (data) => {
    if (data.error) {
      res.status(500);
      res.json({ message: data.error });
    } else {
      res.json(data);
    }
  });
};

module.exports.taskGetPdf = async (req, res) => {
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  const path = require("path");
  console.log(req.params);
  if (req.params.typeDoc == "contractor") {
    try {
      let data = await tasksDoc.getDataFromTableByIdAsyhc(
        req.params.id,
        "contractorspayments"
      );
      console.log(data);
      let idContractor = data.idContractor;
      let contractorData = await tasksDoc.getDataFromTableByIdAsyhc(
        idContractor,
        "contractors"
      );
      let contractor = contractorData.value;
      let date = new Date(data.date);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let strDate = `${year}-${month}-${day}`;
      fileName = `check ${strDate}`;
      filePath = path.join(__dirname, `../contractors/${contractor}`, fileName);
      res.sendFile(`${filePath}`);
    } catch {
      res.status(500);
    }
  }
  if (req.params.typeDoc == "ownerDoc") {
    let pathBills = path.join(__dirname, "..", "docs");
    tasks.getDataFromTableById(req.params.id, "drivers", (data) => {
      if (data.error) {
        res.status(500);
        res.json({ message: data.error });
      } else {
        console.log(data);
        let owner = data.value;
        res.sendFile(`${pathBills}/${owner}/docOwner.pdf`);
      }
    });
  }
  if (
    req.params.typeDoc != "driver" &&
    req.params.typeDoc != "track" &&
    req.params.typeDoc != "ownerDoc" &&
    req.params.typeDoc != "contractor"
  ) {
    tasks.getDataById(req.params.id, "oderslist", (data) => {
      if (data.error) {
        res.status(500);
        res.json({ message: data.error });
      } else {
        let Year = data.date.getFullYear();
        let customer = data.customer[0].value;
        let pathBills = path.join(__dirname, "..", "Bills");
        let accountNumber = Number(data.accountNumber);
        if (isNaN(accountNumber)) {
          accountNumber = data.accountNumber;
        }
        if (req.params.typeDoc == "app") {
          res.sendFile(
            `${pathBills}/${Year}/${customer}/${req.params.typeDoc}/app${req.params.id}.pdf`
          );
        } else {
          res.sendFile(
            `${pathBills}/${Year}/${customer}/${req.params.typeDoc}${accountNumber}.pdf`
          );
        }
      }
    });
  }
  if (req.params.typeDoc == "driver" || req.params.typeDoc == "track") {
    let pathBills = path.join(__dirname, "..", "docs");
    let table = "";
    let trackDriver = "";
    let track = "";
    let owner = "";
    if (req.params.typeDoc == "driver") table = "trackdrivers";
    if (req.params.typeDoc == "track") table = "tracklist";
    tasks.getDataFromTableById(req.params.id, table, (data) => {
      if (data.error) {
        res.status(500);
        res.json({ message: data.error });
      } else {
        console.log(data);
        if (req.params.typeDoc == "driver") trackDriver = data.name;
        if (req.params.typeDoc == "track") track = data.value;
        let idOwner = data.idOwner;
        tasks.getDataFromTableById(idOwner, "drivers", (data) => {
          if (data.error) {
            res.status(500);
            res.json({ message: data.error });
          } else {
            console.log(data);
            owner = data.value;
            if (req.params.typeDoc == "driver")
              res.sendFile(
                `${pathBills}/${owner}/${trackDriver}/docDriver.pdf`
              );
            if (req.params.typeDoc == "track")
              res.sendFile(`${pathBills}/${owner}/${track}/docTrack.pdf`);
          }
        });
      }
    });
  }
};
module.exports.taskGetReportPdf = (req, res) => {
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  const path = require("path");
  let pathBills = path.join(__dirname, "..", "Bills");
  res.sendFile(`${pathBills}/tempDoc.pdf`);
};
module.exports.taskGetPdfWithoutStamp = (req, res) => {
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  const path = require("path");
  tasks.getDataById(req.params.id, "oderslist", (data) => {
    if (data.error) {
      res.status(500);
      res.json({ message: data.error });
    } else {
      let Year = data.date.getFullYear();
      let customer = data.customer[0].value;
      let pathBills = path.join(__dirname, "..", "Bills");
      let accountNumber = Number(data.accountNumber);
      if (isNaN(accountNumber)) {
        accountNumber = data.accountNumber;
      }
      tasks.editField(req.params.id, "oderslist", "wasItPrinted", 1, (data) => {
        if (data.error) {
          res.status(500);
          res.json({ message: data.error });
        } else {
          res.sendFile(
            `${pathBills}/${Year}/${customer}/docWithoutStamp${accountNumber}.pdf`
          );
        }
      });
    }
  });
};

module.exports.taskAdd = (req, res) => {
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  tasks.add(req.body.body, (data, dataOrder) => {
    if (data.error) {
      res.status(500).json({ message: data.error });
    } else {
      let dataIo = { data: data, dataOrder: dataOrder };
      req.app.get("io").emit("orderAdded", dataIo);
      res.json(data);
    }
  });
};
module.exports.taskAddOrderApp = (req, res) => {
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  tasks.addOrderApp(req.body.body, req.body.appId, (data) => {
    if (data.error) {
      res.status(500);
      res.json({ message: data.error });
    } else {
      let dataIo = {
        data: data,
        dataIo: JSON.parse(req.body.body),
        appId: req.body.appId,
      };
      req.app.get("io").emit("madeOrderFromApp", dataIo);
      res.json(data);
    }
  });
};
module.exports.taskAddData = (req, res) => {
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  tasksData.addData(req.body.body, (data) => {
    if (data.error) {
      res.status(500);
      res.json(data.error);
    } else {
      res.json(data);
    }
  });
};

module.exports.taskEdit = (req, res) => {
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS, PATCH");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.set("Access-Control-Allow-Credentials", "true");
  tasks.edit(req.body.body, req.session.userId, false, (data) => {
    console.log(data);
    if (data.error) {
      res.json(data);
    } else {
      let dataIo = { data: data, dataOrder: req.body.body };
      req.app.get("io").emit("orderChanged", dataIo);
      res.json(data);
    }
  });
};
module.exports.taskDelPrintedMark = (req, res) => {
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS, PATCH");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.set("Access-Control-Allow-Credentials", "true");
  console.log(req.session);
  if (req.session.role == "admin") {
    tasks.editField(req.params.id, "oderslist", "wasItPrinted", 0, (data) => {
      if (data.error) {
        res.status(500);
        res.json({ message: data.error });
      } else {
        req.app.get("io").emit("DeletedPrintedMark", req.params.id);
        res.json(data);
      }
    });
  } else {
    res.status(500);
    res.json({ message: data.error });
  }
};
module.exports.taskEditNew = (req, res) => {
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS, PATCH");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  tasks.editNew(req.body.body, (data) => {
    if (data.error) {
      res.status(500);
      res.json({ message: data.error });
    } else {
      req.app.get("io").emit("orderChangedNew", req.body.body);
      res.json(data);
    }
  });
};
module.exports.taskEditData = (req, res) => {
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS, PATCH");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  tasksData.editData(req.body.body, (data) => {
    console.log(data);
    if (data.error) {
      res.status(500);
      res.json({ message: data.error });
    } else {
      res.json(data);
    }
  });
};

module.exports.makePaymentCustomer = (req, res) => {
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS, PATCH");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  tasks.makePaymentCustomer(req.body.body, (data) => {
    if (data.error) {
      res.status(500);
      res.json({ message: data.error.message });
    } else {
      let dataIo = { data: data, dataIo: req.body.body };
      req.app.get("io").emit("madePaymentCustomer", dataIo);
      res.json(data);
    }
  });
};
module.exports.makeDriverDebt = (req, res) => {
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS, PATCH");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  tasksDebt.makeDriverDebt(req.body.body, (data) => {
    if (data.error) {
      res.status(500);
      res.json({ message: data.error });
    } else {
      res.json(data);
    }
  });
};
module.exports.taskDeleteDebt = (req, res) => {
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS, DELETE");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  tasksDebt.del(req.params.id, (data) => {
    if (data.error) {
      res.status(500);
      res.json({ message: data.error });
    } else {
      res.json(data);
    }
  });
};

module.exports.taskDel = (req, res) => {
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS, DELETE");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  tasks.del(req.params.id, (data) => {
    if (data.error) {
      res.status(500);
      res.json({ message: data.error });
    } else {
      console.log(
        "Сервер отправляет событие orderDeleted с ID:",
        req.params.id
      );
      req.app.get("io").emit("orderDeleted", req.params.id);
      res.json(data);
    }
  });
};
module.exports.taskDeleteData = (req, res) => {
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS, DELETE");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  tasksData.delData(req.params.id, req.body.editTable, (data) => {
    if (data.error) {
      res.status(500);
      res.json(data);
    } else {
      res.json(data);
    }
  });
};
module.exports.deleteContractorPayment = (req, res) => {
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS, DELETE");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  taskContractors.delete(req.params.id, (data) => {
    if (data.error) {
      res.status(500);
      res.json(data);
    } else {
      res.json(data);
    }
  });
};

module.exports.deleteAddData = (req, res) => {
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS, DELETE");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  tasksAddData.delete(req.params.id, (data) => {
    if (data.error) {
      res.status(500);
      res.json(data);
    } else {
      res.json(data);
    }
  });
};

module.exports.editDriverDebt = (req, res) => {
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS, PATCH");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  tasksDebt.edit(req.body.body, (data) => {
    if (data.error) {
      res.status(500);
      res.json({ message: data.error });
    } else {
      res.json(data);
    }
  });
};

module.exports.makePaymentDriver = (req, res) => {
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS, PATCH");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  taskPaymentsDriver.add(req.body.body, (data) => {
    if (data.error) {
      res.status(500);
      res.json({ message: data.error.message });
    } else {
      let dataIo = {
        dada: data,
        dataIo: {
          id: req.body.body.id,
          chosenOders: req.body.body.chosenOders,
          chosenDebts: req.body.body.chosenDebts,
          currentDriverSumOfOders: req.body.body.currentDriverSumOfOders,
        },
      };
      console.log(dataIo);
      req.app.get("io").emit("madePaymentDriver", dataIo);
      res.json(data);
    }
  });
};

module.exports.addDataContractorPayment = (req, res) => {
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS, PATCH");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  taskContractors.add(req.body.body, (data) => {
    if (data.error) {
      res.status(500);
      res.json({ message: data.error });
    } else {
      res.json(data);
    }
  });
};

module.exports.taskDeletePayments = (req, res) => {
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS, DELETE");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  tasksPayments.taskDeletePayments(req.params.id, (data) => {
    if (data.error) {
      res.status(500);
      res.json({ message: data.error });
    } else {
      res.json(data);
    }
  });
};

const pdfTemplate = require("../documents/powerOfAttorney.js");

const pdf = require("html-pdf");
const { log } = require("util");
module.exports.taskProxy = (req, res) => {
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS, DELETE");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  const dataById = {};
  tasks.getDataById(req.params.id, "oderslist", (data) => {
    if (data.error) {
      res.status(500);
      res.json({ message: data.error });
    } else {
      dataById.id = req.params.id;
      dataById.driver = data.driver[0].name;
      dataById.customer = data.customer[0].companyName;
      console.log(data.driver[0].value);
      console.log(data.customer[0].value);
      pdf
        .create(pdfTemplate(dataById), {})
        .toFile(`./API/controlers/result${dataById.id}.pdf`, (err) => {
          if (err) {
            res.send(Promise.reject());
          }
          res.send(Promise.resolve());
          //res.render(pdfTemplate(req.params.id));
        });
    }
  });
};
module.exports.taskAddPdfDoc = (req, res) => {
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS, DELETE");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  pdf
    .create(req.body.body, {})
    .toFile(`./API/controlers/Bills/doc${req.params.id}.pdf`, (err) => {
      if (err) {
        res.send(Promise.reject());
      }
      res.send(Promise.resolve());
    });
};
module.exports.taskCreateDoc = (req, res) => {
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS, DELETE");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  console.log("запрос пришел");

  try {
    const exists = fs.existsSync(
      `./API/Bills/${req.body.body.year}/${req.body.body.customer}`
    );
    if (!exists) {
      fs.mkdirSync(
        `./API/Bills/${req.body.body.year}/${req.body.body.customer}`,
        { recursive: true }
      );
    }
  } catch (e) {
    console.log(e);
  }
  console.log("создани папки или проверка");
  fs.writeFile(
    `./API/Bills/${req.body.body.year}/${req.body.body.customer}/doc${req.body.body.invoiceNumber}.pdf`,
    "utf8",
    function (error) {
      if (error) throw error; // если возникла ошибка
      console.log("Асинхронная запись файла завершена. Содержимое файла:");
    }
  );
  console.log("Создание файла");
  (async () => {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox"],
    });
    console.log("Запуск поппитера");
    const page = await browser.newPage();
    console.log("создание пустой страницы");
    await page.setContent(req.body.body.html);
    console.log("создание контента страницы");
    await page.pdf({
      path: `./API/Bills/${req.body.body.year}/${req.body.body.customer}/doc${req.body.body.invoiceNumber}.pdf`,
      format: "a4",
    });
    console.log("создание пдф страницы");
    console.log(req.body.body.invoiceNumber);
    tacksDocs.add(
      req.body.body.arrOrderId,
      req.body.body.invoiceNumber,
      (data) => {
        if (data.error) {
          res.status(500);
          res.json({ message: data.error });
        } else {
          let dataIo = {
            invoiceNumber: req.body.body.invoiceNumber,
            arrOrderId: req.body.body.arrOrderId,
          };
          req.app.get("io").emit("createdDoc", dataIo);
          res.json(data);
        }
      }
    );
    console.log("Добавление номер в БД");
    console.log(new Date());
    await browser.close();
    console.log("закрытие страницы");
  })();
};

module.exports.taskSaveReport = (req, res) => {
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS, DELETE");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  taskReports.reconciliationSavePdf(req.body.body, (data) => {
    if (data.error) {
      res.status(500);
      res.json({ message: data.error });
    } else {
      res.json(data);
    }
  });
};

module.exports.taskEditYearConst = (req, res) => {
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS, DELETE");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  taskReports.editYearConst(req.body, (data) => {
    if (data.error) {
      res.status(500);
      res.json({ message: data.error });
    } else {
      res.json(data);
    }
  });
};

module.exports.taskEditAddData = (req, res) => {
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS, DELETE");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  tasksAddData.editData(req.body.body, (data) => {
    if (data.error) {
      res.status(500);
      res.json({ message: data.error });
    } else {
      res.json(data);
    }
  });
};

module.exports.taskCreateDocWithoutStamp = (req, res) => {
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS, DELETE");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  // const puppeteer = require("puppeteer");
  // var fs = require("fs");
  try {
    const exists = fs.existsSync(
      `./API/Bills/${req.body.body.year}/${req.body.body.customer}`
    );
    if (!exists) {
      fs.mkdirSync(
        `./API/Bills/${req.body.body.year}/${req.body.body.customer}`,
        { recursive: true }
      );
    }
  } catch (e) {
    console.log(e);
  }
  fs.writeFile(
    `./API/Bills/${req.body.body.year}/${req.body.body.customer}/docWithoutStamp${req.body.body.invoiceNumber}.pdf`,
    "utf8",
    function (error) {
      if (error) throw error; // если возникла ошибка
      console.log("Асинхронная запись файла завершена. Содержимое файла:");
    }
  );
  (async () => {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(req.body.body.html);
    await page.pdf({
      path: `./API/Bills/${req.body.body.year}/${req.body.body.customer}/docWithoutStamp${req.body.body.invoiceNumber}.pdf`,
      format: "a4",
    });

    await browser.close();
    console.log("закрытие страницы");
    res.json("success!");
  })();
};

module.exports.taskCreateApp = (req, res) => {
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS, DELETE");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.set("Access-Control-Allow-Credentials", "true");
  console.log(req.body.body.appNumber);
  let newData = {
    id: req.body.body.id,
    field: "applicationNumber",
    newValue: req.body.body.appNumber,
  };
  tasks.edit(newData, req.session.userId, true, (data) => {
    if (data.error) {
      res.json(data);
    }
  });
  try {
    const exists = fs.existsSync(
      `./API/Bills/${req.body.body.year}/${req.body.body.customer}/app`
    );
    if (!exists) {
      fs.mkdirSync(
        `./API/Bills/${req.body.body.year}/${req.body.body.customer}/app`,
        { recursive: true }
      );
    }
  } catch (e) {
    console.log(e);
  }
  fs.writeFile(
    `./API/Bills/${req.body.body.year}/${req.body.body.customer}/app/app${req.body.body.id}.pdf`,
    "utf8",
    function (error) {
      if (error) throw error; // если возникла ошибка
      console.log("Асинхронная запись файла завершена. Содержимое файла:");
      (async () => {
        const browser = await puppeteer.launch({
          args: ["--no-sandbox"],
        });
        const page = await browser.newPage();
        await page.setContent(req.body.body.html);
        await page.pdf({
          path: `./API/Bills/${req.body.body.year}/${req.body.body.customer}/app/app${req.body.body.id}.pdf`,
          format: "a4",
        });
        await browser.close();
        let dataIo = {
          id: req.body.body.id,
          appNumber: req.body.body.appNumber,
        };
        req.app.get("io").emit("createdApp", dataIo);
        res.json("success!");
      })();
    }
  );
};

module.exports.taskAddSomePdfDoc = (req, res) => {
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  console.log(req.params);
  if (req.params.typeDoc == "owner") {
    tasks.getDataFromTableById(req.params.id, "drivers", (data) => {
      if (data.error) {
        res.status(500);
        res.json({ message: data.error });
      } else {
        console.log(data);
        owner = data.value;
        let fs = require("fs");
        try {
          const exists = fs.existsSync(`./API/docs/${owner}`);
          if (!exists) {
            fs.mkdirSync(`./API/docs/${owner}`, {
              recursive: true,
            });
          }
        } catch (e) {
          console.log(e);
        }
        fs.copyFile(
          `./API/Bills/tempDoc.pdf`,
          `./API/docs/${owner}/docOwner.pdf`,
          (err) => {
            if (err) throw err; // не удалось скопировать файл
            console.log("Файл успешно скопирован");
            res.json("success!");
          }
        );
      }
    });
  }
  if (req.params.typeDoc == "customerContract") {
    tasks.getDataFromTableById(req.params.id, "oders", (data) => {
      if (data.error) {
        res.status(500);
        res.json({ message: data.error });
      } else {
        console.log(data);
        customer = data.value;
        let fs = require("fs");
        try {
          const exists = fs.existsSync(`./API/contracts/${customer}`);
          if (!exists) {
            fs.mkdirSync(`./API/contracts/${customer}`, {
              recursive: true,
            });
          }
        } catch (e) {
          console.log(e);
        }
        fs.copyFile(
          `./API/Bills/tempDoc.pdf`,
          `./API/contracts/${customer}/contract.pdf`,
          (err) => {
            if (err) throw err; // не удалось скопировать файл
            console.log("Файл успешно скопирован");
            res.json("success!");
          }
        );
      }
    });
  }
  if (
    req.params.typeDoc != "driver" &&
    req.params.typeDoc != "track" &&
    req.params.typeDoc != "owner" &&
    req.params.typeDoc != "customerContract"
  ) {
    tasks.getDataById(req.params.id, "oderslist", (data) => {
      if (data.error) {
        res.status(500);
        res.json({ message: data.error });
      } else {
        console.log(data);
        let Year = data.date.getFullYear();
        let customer = data.customer[0].value;
        let accountNumber = isNaN(Number(data.accountNumber))
          ? data.accountNumber
          : Number(data.accountNumber);
        let fs = require("fs");
        if (req.params.typeDoc == "ttn") {
          try {
            const exists = fs.existsSync(
              `./API/Bills/${Year}/${customer}/${req.params.typeDoc}`
            );
            if (!exists) {
              fs.mkdirSync(
                `./API/Bills/${Year}/${customer}/${req.params.typeDoc}`,
                {
                  recursive: true,
                }
              );
            }
          } catch (e) {
            console.log(e);
          }
          fs.copyFile(
            `./API/Bills/tempDoc.pdf`,
            `./API/Bills/${Year}/${customer}/${req.params.typeDoc}${accountNumber}.pdf`,
            (err) => {
              if (err) throw err; // не удалось скопировать файл
              console.log("Файл успешно скопирован");
              res.json("success!");
            }
          );
        } else {
          try {
            const exists = fs.existsSync(`./API/Bills/${Year}/${customer}/app`);
            if (!exists) {
              fs.mkdirSync(`./API/Bills/${Year}/${customer}/app`, {
                recursive: true,
              });
            }
          } catch (e) {
            console.log(e);
          }
          fs.copyFile(
            `./API/Bills/tempDoc.pdf`,
            `./API/Bills/${Year}/${customer}/app/${req.params.typeDoc}${req.params.id}.pdf`,
            (err) => {
              if (err) throw err; // не удалось скопировать файл
              console.log("Файл успешно скопирован");
              res.json("success!");
            }
          );
        }
      }
    });
  }
  if (req.params.typeDoc == "driver" || req.params.typeDoc == "track") {
    let table = "";
    let trackDriver = "";
    let track = "";
    let owner = "";
    if (req.params.typeDoc == "driver") table = "trackdrivers";
    if (req.params.typeDoc == "track") table = "tracklist";
    tasks.getDataFromTableById(req.params.id, table, (data) => {
      if (data.error) {
        res.status(500);
        res.json({ message: data.error });
      } else {
        console.log(data);
        if (req.params.typeDoc == "driver") trackDriver = data.name;
        if (req.params.typeDoc == "track") track = data.value;
        let idOwner = data.idOwner;
        tasks.getDataFromTableById(idOwner, "drivers", (data) => {
          if (data.error) {
            res.status(500);
            res.json({ message: data.error });
          } else {
            console.log(data);
            owner = data.value;
            let fs = require("fs");
            if (req.params.typeDoc == "driver") {
              try {
                const exists = fs.existsSync(
                  `./API/docs/${owner}/${trackDriver}`
                );
                if (!exists) {
                  fs.mkdirSync(`./API/docs/${owner}/${trackDriver}`, {
                    recursive: true,
                  });
                }
              } catch (e) {
                console.log(e);
              }
              fs.copyFile(
                `./API/Bills/tempDoc.pdf`,
                `./API/docs/${owner}/${trackDriver}/docDriver.pdf`,
                (err) => {
                  if (err) throw err; // не удалось скопировать файл
                  console.log("Файл успешно скопирован");
                  res.json("success!");
                }
              );
            }
            if (req.params.typeDoc == "track") {
              try {
                console.log(`./API/docs/${owner}/${track}`);
                const exists = fs.existsSync(`./API/docs/${owner}/${track}`);
                if (!exists) {
                  fs.mkdirSync(`./API/docs/${owner}/${track}`, {
                    recursive: true,
                  });
                }
              } catch (e) {
                console.log(e);
              }
              fs.copyFile(
                `./API/Bills/tempDoc.pdf`,
                `./API/docs/${owner}/${track}/docTrack.pdf`,
                (err) => {
                  if (err) throw err; // не удалось скопировать файл
                  console.log("Файл успешно скопирован");
                  res.json("success!");
                }
              );
            }
          }
        });
      }
    });
  }
};
module.exports.taskSendEmail = (req, res) => {
  res.set("Access-Control-Allow-Credentials", "true");
  console.log(req.body, req.session.userId);
  const configEmail = require("../models/config.js");
  tasks.getDataById(req.body.id, "oderslist", (data) => {
    if (data.error) {
      res.status(500);
      res.json({ message: data.error });
    } else {
      let Year = data.date.getFullYear();
      let customer = data.customer[0].value;
      let email = "sergivnik@mail.ru";
      if (data.customer[0].email != "" && data.customer[0].email != null) {
        email = email + ", " + data.customer[0].email;
      }
      if (data.manager != undefined) {
        if (data.manager[0].email != "" && data.manager[0].email != null) {
          email = email + ", " + data.manager[0].email;
        }
      }
      if (req.body.email != null) {
        email = email + ", " + req.body.email;
      }
      let accountNumber = isNaN(Number(data.accountNumber))
        ? data.accountNumber
        : Number(data.accountNumber);
      let driver = data.driver[0].shortName;
      const nodemailer = require("nodemailer");
      let subject = "";
      if (email == "sergivnik@mail.ru") {
        subject = `Счет ${accountNumber} заказчику ${data.customer[0].companyName} не отправлен`;
      } else {
        subject = `Счет ${accountNumber} от ${data.date.toLocaleDateString()} за перевозку водитель ${driver} заказчик ${
          data.customer[0].companyName
        }`;
      }
      console.log(email);
      async function main() {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport(configEmail.email);

        // send mail with defined transport object
        let attachmentFiles = [
          {
            path: `./API/Bills/${Year}/${customer}/doc${accountNumber}.pdf`,
          },
        ];
        const fs = require("fs");

        try {
          if (
            fs.existsSync(
              `./API/Bills/${Year}/${customer}/ttn${accountNumber}.pdf`
            )
          ) {
            attachmentFiles.push({
              path: `./API/Bills/${Year}/${customer}/ttn${accountNumber}.pdf`,
            });
          }
          if (
            fs.existsSync(
              `./API/Bills/${Year}/${customer}/app/app${req.body.id}.pdf`
            ) &&
            req.body.app
          ) {
            console.log("application added");
            attachmentFiles.push({
              path: `./API/Bills/${Year}/${customer}/app/app${req.body.id}.pdf`,
            });
          }
        } catch (err) {
          console.error(err);
        }
        let info = await transporter.sendMail({
          from: '"ИП Иванов Сергей" <sergivnik@mail.ru>', // sender address
          to: email, // list of receivers
          subject: subject, // Subject line
          text: req.body.text ? req.body.text : "",
          html: `<p>${
            req.body.text ? req.body.text : ""
          }</p><b>ИП Иванов С.Н. тел. +7-991-366-13-66</b>`, // html body
          attachments: attachmentFiles,
        });
      }

      main()
        .then(() => {
          if (
            data.order.customerPayment == "Нет" ||
            data.order.customerPayment == "Печать"
          ) {
            tasks.edit(
              {
                field: "customerPayment",
                newValue: 3,
                id: Number(req.body.id),
              },
              req.session.userId,
              true,
              (data) => {
                console.log(data);
                if (data.error) {
                  res.status(500);
                  res.json({ message: data.error });
                } else {
                  req.app.get("io").emit("sentEmail", req.body.id);
                  res.json(data);
                }
              }
            );
          } else {
            res.json("success!");
          }
        })
        .catch(console.error);
    }
  });
};
module.exports.taskSendReportEmail = (req, res) => {
  taskReports.sendEmail(req.params.email, (data) => {
    if (data.error) {
      res.status(500);
      res.json({ message: data.error });
    } else {
      res.json(data);
    }
  });
};
module.exports.taskAddNewUser = (req, res) => {
  tasksUser.addNewUser(req.body.body, (data) => {
    if (data.error) {
      res.status(500);
      res.json({ message: data.error });
    } else {
      res.json(data);
    }
  });
};
module.exports.taskCheckUser = (req, res) => {
  res.set("Access-Control-Allow-Credentials", "true");
  // req.session.cookie.sameSite = "none";
  // req.session.cookie.secure = true;

  tasksUser.checkUser(req.body, (data, id) => {
    if (data.error) {
      console.log(data);
      res.json(data);
    } else {
      if (data) {
        console.log(data);
        writeLogToFile(data.name);
        req.session.userId = id;
        req.session.login = data.login;
        req.session.name = data.name;
        req.session.role = data.role;
        req.session.customerId = data.customerId;
        req.session.managerID = data.managerID;
      }
      res.json(data);
    }
  });
};
module.exports.taskGetUser = (req, res) => {
  res.set("Access-Control-Allow-Credentials", "true");
  console.log(1, req.sessionID, req.session.userId);
  writeLogToFile(req.session.name);
  if (req.session.userId) {
    let data = {
      _id: req.session.userId,
      name: req.session.name,
      role: req.session.role,
      managerID: req.session.managerID,
      customerId: req.session.customerId,
    };
    res.json(data);
  } else {
    res.json({ error: "no authorized users" });
  }
};
module.exports.taskSignOut = (req, res) => {
  res.set("Access-Control-Allow-Credentials", "true");
  if (req.session.userId != undefined) {
    req.session.destroy();
    res.json("success!!");
  } else {
    res.status(500);
    res.json({ message: "error" });
  }
};
module.exports.taskChangePassword = (req, res) => {
  res.set("Access-Control-Allow-Credentials", "true");
  console.log("API:", req.session.userId, req.session.login, req.body);
  if (req.session.login == req.body.login) {
    tasksUser.changePassword(req.session.userId, req.body, (data) => {
      console.log(data);
      if (data.error) {
        res.json(data.error);
      } else {
        res.json(data);
      }
    });
  }
};
