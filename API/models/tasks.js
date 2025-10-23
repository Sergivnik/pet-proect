const mysql = require('mysql2');
const db = require('./db.js').promisePool;
const dateToSqlString = dateSomeFormate => {
  let date = new Date(dateSomeFormate);
  let Year = date.getFullYear();
  let Month = date.getMonth() + 1;
  let Day = date.getDate();
  return `${Year}-${Month}-${Day}`;
};
var Tasks = {
  list: async function (userId, callback) {
    console.log('list', userId);
    try {
      const [[userData]] = await db.query(`SELECT ownerId FROM users WHERE _id = ?`, [userId]);
      const ownerId = userData.ownerId;
      const allData = {};
      // Запросы без зависимостей — параллельно
      const [
        [dates],
        [citieslist],
        [driverlist],
        [clientList],
        [accountList],
        [clientmanager],
        [trackdrivers],
        [tracklist],
        [addtable],
        [storelist],
        [driverpayments],
        [contractorspayments],
        [customerpayment],
        [contractors],
        [incomereport],
        [yearconst],
        [customerWithoutPayment],
      ] = await Promise.all([
        db.query(`SELECT DISTINCT date FROM oderslist WHERE ownerId = ?`, [ownerId]),
        db.query(`SELECT * FROM cities ORDER BY value`),
        db.query(`SELECT * FROM drivers WHERE ownerId = ? ORDER BY value`, [ownerId]),
        db.query(`SELECT * FROM oders WHERE ownerId = ? ORDER BY value`, [ownerId]),
        db.query(
          `SELECT DISTINCT accountNumber FROM oderslist WHERE ownerId = ? ORDER BY accountNumber`,
          [ownerId]
        ),
        db.query(`SELECT * FROM clientmanager WHERE ownerId = ? ORDER BY value`, [ownerId]),
        db.query(`SELECT * FROM trackdrivers WHERE ownerId = ? ORDER BY value`, [ownerId]),
        db.query(`SELECT * FROM tracklist WHERE ownerId = ? ORDER BY value`, [ownerId]),
        db.query(`SELECT * FROM addtable WHERE ownerId = ? ORDER BY orderId`, [ownerId]),
        db.query(`SELECT * FROM storelist WHERE ownerId = ? ORDER BY value`, [ownerId]),
        db.query(`SELECT * FROM driverpayment WHERE ownerId = ? ORDER BY date`, [ownerId]),
        db.query(`SELECT * FROM contractorspayments WHERE ownerId = ? ORDER BY date`, [ownerId]),
        db.query(`SELECT * FROM customerpayment WHERE ownerId = ? ORDER BY date`, [ownerId]),
        db.query(`SELECT * FROM contractors WHERE ownerId = ?`, [ownerId]),
        db.query(`SELECT * FROM incomereport WHERE ownerId = ?`, [ownerId]),
        db.query(`SELECT * FROM yearconst WHERE ownerId = ?`, [ownerId]),
        db.query(
          `SELECT DISTINCT idCustomer FROM oderslist WHERE customerPayment != 'Ок' AND ownerId = ?`,
          [ownerId]
        ),
      ]);

      // Веса
      const [[maxCustomerPrice], [minCustomerPrice], [maxDriverPrice], [minDriverPrice]] =
        await Promise.all([
          db.query(
            `SELECT MAX(customerPrice) AS maxCustomerPrice FROM oderslist WHERE date > DATE_ADD(SYSDATE(), INTERVAL -5 YEAR) AND ownerId = ?`,
            [ownerId]
          ),
          db.query(
            `SELECT MIN(customerPrice) AS minCustomerPrice FROM oderslist WHERE date > DATE_ADD(SYSDATE(), INTERVAL -5 YEAR) AND ownerId = ?`,
            [ownerId]
          ),
          db.query(
            `SELECT MAX(driverPrice) AS maxDriverPrice FROM oderslist WHERE date > DATE_ADD(SYSDATE(), INTERVAL -5 YEAR) AND ownerId = ?`,
            [ownerId]
          ),
          db.query(
            `SELECT MIN(driverPrice) AS minDriverPrice FROM oderslist WHERE date > DATE_ADD(SYSDATE(), INTERVAL -5 YEAR) AND ownerId = ?`,
            [ownerId]
          ),
        ]);

      // Финансы
      const [
        [incomeOkRes],
        [incomePartRes],
        [driverPaymentRes],
        [driverDebtReturnRes],
        [contractorsPaymentsRes],
      ] = await Promise.all([
        db.query(
          `SELECT SUM(customerPrice) AS income FROM oderslist WHERE customerPayment = 'Ок' AND ownerId = ?`,
          [ownerId]
        ),
        db.query(
          `SELECT SUM(partialPaymentAmount) AS income FROM oderslist WHERE customerPayment = 'Частично оплачен' AND ownerId = ?`,
          [ownerId]
        ),
        db.query(
          `SELECT SUM(driverPrice) AS expenses FROM oderslist WHERE driverPayment = 'Ок' AND ownerId = ?`,
          [ownerId]
        ),
        db.query(`SELECT SUM(sumOfDebts) AS debt FROM driverpayment WHERE ownerId = ?`, [ownerId]),
        db.query(
          `SELECT SUM(sum) AS contractorsPayments FROM contractorspayments WHERE ownerId = ?`,
          [ownerId]
        ),
      ]);

      const incomeOk = Number(incomeOkRes[0].income || 0);
      const incomePart = Number(incomePartRes[0].income || 0);
      const driverPayment = Number(driverPaymentRes[0].expenses || 0);
      const driverDebtReturn = Number(driverDebtReturnRes[0].debt || 0);
      const contractorsPayments = Number(contractorsPaymentsRes[0].contractorsPayments || 0);

      allData.date = dates;
      allData.citieslist = citieslist;
      allData.driverlist = driverlist;
      allData.clientList = clientList;
      allData.accountList = accountList;
      allData.clientmanager = clientmanager;
      allData.trackdrivers = trackdrivers;
      allData.tracklist = tracklist;
      allData.addtable = addtable;
      allData.storelist = storelist;
      allData.driverpayments = driverpayments;
      allData.contractorspayments = contractorspayments;
      allData.customerpayment = customerpayment;
      allData.contractors = contractors;
      allData.incomereport = incomereport;
      allData.yearconst = yearconst;
      allData.customerWithoutPayment = customerWithoutPayment;

      allData.maxCustomerPrice = maxCustomerPrice[0].maxCustomerPrice || 0;
      allData.minCustomerPrice = minCustomerPrice[0].minCustomerPrice || 0;
      allData.maxDriverPrice = maxDriverPrice[0].maxDriverPrice || 0;
      allData.minDriverPrice = minDriverPrice[0].minDriverPrice || 0;

      allData.income = incomeOk + incomePart;
      allData.expenses = driverPayment - driverDebtReturn + contractorsPayments;

      // odersList (сортировка сразу, без вложенного SELECT)
      const [odersList] = await db.query(
        `(SELECT * FROM oderslist WHERE ownerId = ? ORDER BY _id DESC LIMIT 5000) ORDER BY date, accountNumber, _id`,
        [ownerId]
      );
      allData.odersList = odersList;
      const [driverorderlist] = await db.query(
       `(SELECT * FROM driverorderlist WHERE ownerId = ? ORDER BY _id DESC LIMIT 5000) ORDER BY date, accountNumber, _id`,
        [ownerId]
      );
      allData.driverorderlist = driverorderlist;

      callback(allData);
    } catch (err) {
      console.error('list error:', err);
      callback({ error: err.message });
    } finally {
    }
  },

  order5000: async function (userId, callback) {
    console.log('order5000');
    try {
      let [userData] = await db.query(`SELECT * FROM users WHERE _id = ?`, [userId]);
      let ownerId = userData[0].ownerId;
      let [data] = await db.query(
        `(SELECT * FROM oderslist WHERE ownerId = ? ORDER BY _id DESC LIMIT 5000) ORDER BY date, accountNumber, _id`,
        [ownerId]
      );
      callback(data);
    } catch (err) {
      callback({ error: err });
    }
  },

  filter: async function (datafilter, callback) {
    let filterStr = '';
    let filterDate = '';
    let filterDriver = '';
    let filterOder = '';
    let filterLoad = '';
    let filterUnload = '';
    let filterCustomerPrice = '';
    let filterDriverPrice = '';
    let filterProxy = '';
    let filterCompleted = '';
    let filterDocuments = '';
    let filterCustomerPayment = '';
    let filterDriverPayment = '';
    let filterAccount = '';
    let filterArr = [];
    let setData = {};
    if (datafilter.date.length) {
      let felterDateStr = null;
      datafilter.date.forEach(element => {
        if (felterDateStr) {
          felterDateStr = felterDateStr + ',' + `'${element}'`;
        } else {
          felterDateStr = `'${element}'`;
        }
      });
      filterArr[0] = `date in (${felterDateStr}) `;
    }
    if (datafilter.driver.length) {
      filterArr[1] = `idDriver in (${datafilter.driver})`;
    }
    if (datafilter.oder.length) {
      filterArr[2] = `idCustomer in (${datafilter.oder})`;
    }
    if (datafilter.cityLoading.length) {
      let str = '';
      let cityLoadingStr = null;
      datafilter.cityLoading.forEach(elem => {
        str = `JSON_CONTAINS(idLoadingPoint, '${elem}')`;
        cityLoadingStr ? (cityLoadingStr = cityLoadingStr + ' or ' + str) : (cityLoadingStr = str);
      });
      filterArr[3] = '(' + cityLoadingStr + ')';
    }
    if (datafilter.cityUnloading.length) {
      let str = '';
      let cityUnloadingStr = null;
      datafilter.cityUnloading.forEach(elem => {
        str = `JSON_CONTAINS(idUnloadingPoint, '${elem}')`;
        cityUnloadingStr
          ? (cityUnloadingStr = cityUnloadingStr + ' or ' + str)
          : (cityUnloadingStr = str);
      });
      filterArr[4] = '(' + cityUnloadingStr + ')';
    }
    if (datafilter.customerPrice.length) {
      filterArr[5] = ` customerPrice between ${datafilter.customerPrice[0]} and ${datafilter.customerPrice[1]}`;
    }
    if (datafilter.driverPrice.length) {
      filterArr[6] = ` driverPrice between ${datafilter.driverPrice[0]} and ${datafilter.driverPrice[1]}`;
    }
    if (datafilter.proxy.length) {
      filterArr[7] = `proxy in (${datafilter.proxy})`;
    }
    if (datafilter.completed.length) {
      filterArr[8] = `completed in (${datafilter.completed})`;
    }
    if (datafilter.documents.length) {
      filterArr[9] = `document in (${datafilter.documents})`;
    }
    if (datafilter.customerPayment.length) {
      filterArr[10] = `customerPayment in (${datafilter.customerPayment})`;
    }
    if (datafilter.driverPayment.length) {
      filterArr[11] = `driverPayment in (${datafilter.driverPayment})`;
    }
    if (datafilter.accountList.length) {
      let accountStr = '';
      datafilter.accountList.forEach(elem => {
        if (accountStr == '') {
          accountStr = `"${elem.value}"`;
        } else {
          accountStr = accountStr + `, "${elem.value}"`;
        }
      });
      filterArr[12] = `accountNumber in (${accountStr})`;
    }

    filterArr.forEach((str, index) => {
      if (str) {
        filterStr ? (filterStr = filterStr + ' and ' + str) : (filterStr = str);
        if (index != 0) {
          filterDate ? (filterDate = filterDate + ' and ' + str) : (filterDate = str);
        }
        if (index != 1) {
          filterDriver ? (filterDriver = filterDriver + ' and ' + str) : (filterDriver = str);
        }
        if (index != 2) {
          filterOder ? (filterOder = filterOder + ' and ' + str) : (filterOder = str);
        }
        if (index != 3) {
          filterLoad ? (filterLoad = filterLoad + ' and ' + str) : (filterLoad = str);
        }
        if (index != 4) {
          filterUnload ? (filterUnload = filterUnload + ' and ' + str) : (filterUnload = str);
        }
        if (index != 5) {
          filterCustomerPrice
            ? (filterCustomerPrice = filterCustomerPrice + ' and ' + str)
            : (filterCustomerPrice = str);
        }
        if (index != 6) {
          filterDriverPrice
            ? (filterDriverPrice = filterDriverPrice + ' and ' + str)
            : (filterDriverPrice = str);
        }
        if (index != 7) {
          filterProxy ? (filterProxy = filterProxy + ' and ' + str) : (filterProxy = str);
        }
        if (index != 8) {
          filterCompleted
            ? (filterCompleted = filterCompleted + ' and ' + str)
            : (filterCompleted = str);
        }
        if (index != 9) {
          filterDocuments
            ? (filterDocuments = filterDocuments + ' and ' + str)
            : (filterDocuments = str);
        }
        if (index != 10) {
          filterCustomerPayment
            ? (filterCustomerPayment = filterCustomerPayment + ' and ' + str)
            : (filterCustomerPayment = str);
        }
        if (index != 11) {
          filterDriverPayment
            ? (filterDriverPayment = filterDriverPayment + ' and ' + str)
            : (filterDriverPayment = str);
        }
        if (index != 12) {
          filterAccount ? (filterAccount = filterAccount + ' and ' + str) : (filterAccount = str);
        }
      }
    });

    try {
      if (filterDate) {
        [data] = await db.query(`SELECT DISTINCT date FROM oderslist WHERE ${filterDate}`);
      } else [data] = await db.query(`SELECT DISTINCT date FROM oderslist`);
      setData.date = data;
      if (filterDriver) {
        [data] = await db.query(`SELECT DISTINCT idDriver FROM oderslist WHERE ${filterDriver}`);
      } else [data] = await db.query(`SELECT DISTINCT idDriver FROM oderslist`);
      setData.driver = data;
      if (filterOder) {
        [data] = await db.query(`SELECT DISTINCT idCustomer FROM oderslist WHERE ${filterOder}`);
      } else [data] = await db.query(`SELECT DISTINCT idCustomer FROM oderslist`);
      setData.customer = data;
      if (filterLoad) {
        [data] = await db.query(
          `SELECT DISTINCT idLoadingPoint FROM oderslist WHERE ${filterLoad}`
        );
      } else [data] = await db.query(`SELECT DISTINCT idLoadingPoint FROM oderslist`);
      setData.loadingPoint = data;
      if (filterUnload) {
        [data] = await db.query(
          `SELECT DISTINCT idUnloadingPoint FROM oderslist WHERE ${filterUnload}`
        );
      } else [data] = await db.query(`SELECT DISTINCT idUnloadingPoint FROM oderslist`);
      setData.unloadingPoint = data;
      setData.filteredCustomerPrice = [];
      if (filterCustomerPrice) {
        [data] = await db.query(
          `SELECT min(customerPrice) as 'minCustomerPrice' FROM oderslist WHERE ${filterCustomerPrice}`
        );
      } else {
        [data] = await db.query(
          `SELECT min(customerPrice) as 'minCustomerPrice' FROM oderslist WHERE date > DATE_ADD(SYSDATE(),INTERVAL -5 YEAR)`
        );
      }
      setData.filteredCustomerPrice[0] = data[0].minCustomerPrice;
      if (filterCustomerPrice) {
        [data] = await db.query(
          `SELECT max(customerPrice) as 'maxCustomerPrice' FROM oderslist WHERE ${filterCustomerPrice}`
        );
      } else {
        [data] = await db.query(
          `SELECT max(customerPrice) as 'maxCustomerPrice' FROM oderslist WHERE date > DATE_ADD(SYSDATE(),INTERVAL -5 YEAR)`
        );
      }
      setData.filteredCustomerPrice[1] = data[0].maxCustomerPrice;
      setData.filteredDriverPrice = [];
      if (filterDriverPrice) {
        [data] = await db.query(
          `SELECT min(driverPrice) as 'minDriverPrice' FROM oderslist WHERE ${filterDriverPrice}`
        );
      } else {
        [data] = await db.query(
          `SELECT min(driverPrice) as 'minDriverPrice' FROM oderslist WHERE date > DATE_ADD(SYSDATE(),INTERVAL -5 YEAR)`
        );
      }
      setData.filteredDriverPrice[0] = data[0].minDriverPrice;
      if (filterDriverPrice) {
        [data] = await db.query(
          `SELECT max(driverPrice) as 'maxDriverPrice' FROM oderslist WHERE ${filterDriverPrice}`
        );
      } else {
        [data] = await db.query(
          `SELECT max(driverPrice) as 'maxDriverPrice' FROM oderslist WHERE date > DATE_ADD(SYSDATE(),INTERVAL -5 YEAR)`
        );
      }
      setData.filteredDriverPrice[1] = data[0].maxDriverPrice;
      if (filterProxy) {
        [data] = await db.query(`SELECT DISTINCT proxy FROM oderslist WHERE ${filterProxy}`);
      } else [data] = await db.query(`SELECT DISTINCT proxy FROM oderslist`);
      setData.proxy = data;
      if (filterCompleted) {
        [data] = await db.query(
          `SELECT DISTINCT completed FROM oderslist WHERE ${filterCompleted}`
        );
      } else [data] = await db.query(`SELECT DISTINCT completed FROM oderslist`);
      setData.proxy = data;
      if (filterDocuments) {
        [data] = await db.query(`SELECT DISTINCT document FROM oderslist WHERE ${filterDocuments}`);
      } else [data] = await db.query(`SELECT DISTINCT document FROM oderslist`);
      setData.documents = data;
      if (filterCustomerPayment) {
        [data] = await db.query(
          `SELECT DISTINCT customerPayment FROM oderslist WHERE ${filterCustomerPayment}`
        );
      } else [data] = await db.query(`SELECT DISTINCT customerPayment FROM oderslist`);
      setData.customerPayment = data;
      if (filterDriverPayment) {
        [data] = await db.query(
          `SELECT DISTINCT driverPayment FROM oderslist WHERE ${filterDriverPayment}`
        );
      } else [data] = await db.query(`SELECT DISTINCT driverPayment FROM oderslist`);
      setData.driverPayment = data;
      if (filterAccount) {
        [data] = await db.query(
          `SELECT DISTINCT accountNumber FROM oderslist WHERE ${filterAccount}`
        );
      } else [data] = await db.query(`SELECT DISTINCT accountNumber FROM oderslist`);
      setData.filterAccount = data;

      [data] = await db.query(
        `(SELECT * FROM oderslist WHERE ${filterStr} ORDER BY _id DESC LIMIT 50000) ORDER BY _id`
      );
      setData.odersList = data;
      callback(setData);
    } catch (err) {
      callback({ error: err });
    }
  },
  add: async function (data, callback) {
    console.log(data);
    data = JSON.parse(data);
    let oder = {
      date: data.date,
      idDriver: data.idDriver,
      idCustomer: data.idCustomer,
      idLoadingPoint: JSON.stringify(data.idLoadingPoint),
      idUnloadingPoint: JSON.stringify(data.idUnloadingPoint),
      customerPrice: data.customerPrice,
      driverPrice: data.driverPrice,
      idManager: data.idManager,
      idTrackDriver: data.idTrackDriver,
      idTrack: data.idTrack,
      loadingInfo: JSON.stringify(data.loadingInfo),
      unloadingInfo: JSON.stringify(data.unloadingInfo),
      completed: data.completed,
      applicationNumber: data.applicationNumber,
      colorTR: data.colorTR,
    };
    let dataOrder = data;
    let addData = {
      customerId: data.idCustomer,
      sum: data.price,
      interest: data.interest,
      orderId: null,
    };
    if (oder.customerPrice === '') oder.customerPrice = null;
    if (oder.driverPrice === '') oder.driverPrice = null;

    try {
      let [data] = await db.query('INSERT INTO oderslist SET ?', oder);
      addData.orderId = data.insertId;
      if (oder.colorTR == 'hotpink') {
        await db.query(`INSERT INTO addtable SET ?`, addData);
      }
      callback(data, dataOrder);
    } catch (err) {
      callback({ error: err });
    }
  },
  editNew: async function (data, callback) {
    dateToSqlString(data.dateOfSubmission);
    console.log(data);
    let addData;
    let newData = {
      date: dateToSqlString(data.date),
      idDriver: data.idDriver,
      idCustomer: data.idCustomer,
      idLoadingPoint: JSON.stringify(data.idLoadingPoint),
      idUnloadingPoint: JSON.stringify(data.idUnloadingPoint),
      customerPrice: data.customerPrice,
      driverPrice: data.driverPrice,
      proxy: data.proxy,
      document: data.document,
      dateOfSubmission: dateToSqlString(data.dateOfSubmission),
      customerPayment: data.customerPayment,
      dateOfPromise: dateToSqlString(data.dateOfPromise),
      driverPayment: data.driverPayment,
      accountNumber: data.accountNumber,
      partialPaymentAmount: data.partialPaymentAmount,
      idTrackDriver: data.idTrackDriver,
      idTrack: data.idTrack,
      idManager: data.idManager,
      applicationNumber: data.applicationNumber,
      colorTR: data.colorTR,
      loadingInfo: JSON.stringify(data.loadingInfo),
      unloadingInfo: JSON.stringify(data.unloadingInfo),
    };
    console.log(newData);
    if (data.colorTR == 'hotpink') {
      addData = {
        customerId: data.idCustomer,
        sum: data.price,
        interest: data.interest,
        orderId: data._id,
      };
    }
    try {
      await db.query(`UPDATE oderslist SET ? WHERE _id = ?`, [newData, data._id]);
      if (data.colorTR == 'hotpink') {
        let [q] = await db.query(`SELECT * FROM addtable WHERE orderId = ?`, [data._id]);
        if (q.length) {
          await db.query(`UPDATE addtable SET ? WHERE orderId = ?`, [addData, data._id]);
        } else {
          await db.query(`INSERT INTO addtable SET ?`, addData);
        }
      }
      callback(data);
    } catch (err) {
      console.log(err);
      callback({ error: err });
    }
  },
  edit: async function (newdata, userId, isAllowed, callback) {
    console.log(newdata, userId, isAllowed);
    let allowedField = isAllowed;
    switch (newdata.field) {
      case 'date':
        change = { date: newdata.newValue };
        break;
      case 'driver':
        change = { idDriver: newdata.newValue };
        break;
      case 'oders':
        change = { idCustomer: newdata.newValue };
        break;
      case 'loadingPoint':
        change = { idLoadingPoint: JSON.stringify(newdata.newValue) };
        break;
      case 'unloadingPoint':
        change = { idUnloadingPoint: JSON.stringify(newdata.newValue) };
        break;
      case 'oderPrice':
        change = { customerPrice: newdata.newValue };
        break;
      case 'driverPrice':
        change = { driverPrice: newdata.newValue };
        break;
      case 'proxy':
        change = { proxy: newdata.newValue };
        break;
      case 'completed':
        allowedField = true;
        change = { completed: newdata.newValue };
        break;
      case 'document':
        allowedField = true;
        let now = new Date();
        if (newdata.newValue == 2) now = null;
        change = { document: newdata.newValue, dateOfSubmission: now };
        break;
      case 'customerPayment':
        if (newdata.newValue == 5) allowedField = true;
        if (newdata.newValue == 1 || newdata.newValue == 2) {
          change = {
            customerPayment: newdata.newValue,
            dateOfPromise: null,
            partialPaymentAmount: null,
          };
        }
        if (
          newdata.newValue == 3 ||
          newdata.newValue == 4 ||
          newdata.newValue == 5 ||
          newdata.newValue == 7
        ) {
          let now = new Date();
          change = {
            customerPayment: newdata.newValue,
            dateOfPromise: now,
            partialPaymentAmount: null,
          };
        }
        if (newdata.newValue == 6 || newdata.newValue == 8) {
          change = {
            customerPayment: newdata.newValue,
            dateOfPromise: null,
            partialPaymentAmount: null,
          };
        }
        break;
      case 'driverPayment':
        change = { driverPayment: newdata.newValue };
        break;
      case 'accountNumber':
        change = { accountNumber: newdata.newValue };
        break;
      case 'dateOfPromise':
        change = { dateOfPromise: newdata.newValue };
        break;
      case 'sumPartPay':
        change = { partialPaymentAmount: newdata.newValue };
        break;
      case 'applicationNumber':
        change = { applicationNumber: newdata.newValue };
        break;
      default:
        break;
    }
    try {
      let [userRole] = await db.query(`SELECT * FROM users WHERE _id = ?`, [userId]);
      console.log(userRole[0]);
      if (userRole[0].role == 'admin' || allowedField == true) {
        let [data] = await db.query(`UPDATE oderslist SET ? WHERE _id = ?`, [change, newdata.id]);
        callback(data);
      } else {
        callback({ error: 'Недостаточно прав для редактирования этого поля' });
      }
    } catch (err) {
      //console.log(err);
      callback({ error: err });
    }
  },

  makePaymentCustomer: async function (data, callback) {
    console.log(data);
    const now = new Date();
    // Приводим к формату YYYY-MM-DD HH:MM:SS
    const formattedNow = now
      .toLocaleString('sv-SE', {
        timeZone: 'Europe/Moscow',
      })
      .replace('T', ' ');
    console.log(now);
    let sumChosenOders = data.arr.reduce((sum, item) => sum + item.customerPrice, 0);
    let idList = data.arr.map(elem => elem.id);

    // Начинаем транзакцию
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      let [dataelem] = await connection.query(
        `SELECT * FROM pet_proect.oderslist WHERE _id IN (?)`,
        [idList]
      );
      for (const elem of dataelem) {
        if (elem.customerPayment == 'Ок')
          throw new Error('Некоторые заказы уже оплачены обновите страницу');
      }
      let [dataOder] = await connection.query(`SELECT * FROM pet_proect.oderslist WHERE _id = ?`, [
        data.arr[0].id,
      ]);
      let customerId = dataOder[0].idCustomer;
      console.log(sumChosenOders);
      console.log(data.sumCustomerPayment + data.extraPayments);
      console.log(sumChosenOders == data.sumCustomerPayment + data.extraPayments);
      if (sumChosenOders == Number(data.sumCustomerPayment) + Number(data.extraPayments)) {
        await connection.query(`UPDATE oders SET extraPayments = NULL WHERE _id = ?`, [customerId]);
      } else {
        await connection.query(`UPDATE oders SET extraPayments = ? WHERE _id = ?`, [
          data.extraPayments + Number(data.sumCustomerPayment) - sumChosenOders,
          customerId,
        ]);
      }
      for (let i = 0; i < data.arr.length; i++) {
        let index = data.arr.findIndex(element => element.id == dataelem[i]._id);
        console.log(dataelem[i]._id, data.arr[index]);
        if (dataelem[i].customerPrice == data.arr[index].customerPrice) {
          await connection.query(
            `UPDATE oderslist SET customerPayment = "Ок", dateOfPromise = ? WHERE _id = ?`,
            [formattedNow, data.arr[index].id]
          );
        } else {
          if (
            dataelem[i].customerPayment == 'Частично оплачен' &&
            dataelem[i].customerPrice - dataelem[i].partialPaymentAmount ==
              data.arr[index].customerPrice
          ) {
            await connection.query(
              `UPDATE oderslist SET customerPayment = "Ок", partialPaymentAmount = NULL WHERE _id = ?`,
              [data.arr[index].id]
            );
          }
          if (
            dataelem[i].customerPayment == 'Частично оплачен' &&
            dataelem[i].customerPrice - dataelem[i].partialPaymentAmount !=
              data.arr[index].customerPrice
          ) {
            await connection.query(
              `UPDATE oderslist SET customerPayment = "Частично оплачен", partialPaymentAmount = ? WHERE _id = ?`,
              [
                Number(data.arr[index].customerPrice) + Number(dataelem[i].partialPaymentAmount),
                data.arr[index].id,
              ]
            );
          }
          if (dataelem[i].customerPayment != 'Частично оплачен') {
            await connection.query(
              `UPDATE oderslist SET customerPayment = "Частично оплачен", partialPaymentAmount = ? WHERE _id = ?`,
              [Number(data.arr[index].customerPrice), data.arr[index].id]
            );
          }
        }
      }
      let paymentString = {
        date: new Date(data.date),
        idCustomer: customerId,
        sumOfPayment: Number(data.sumCustomerPayment),
        sumExtraPayment: data.extraPayments,
        listOfOders: JSON.stringify(data.arr),
      };
      console.log(paymentString);
      await connection.query('INSERT INTO customerpayment SET ?', paymentString);
      let [dataChanged] = await connection.query(
        `SELECT * FROM pet_proect.oderslist WHERE _id IN (?)`,
        [idList]
      );

      // Подтверждаем транзакцию
      await connection.commit();

      callback(dataChanged);
    } catch (err) {
      // Откатываем транзакцию в случае ошибки
      await connection.rollback();
      console.log(err);
      callback({ error: err });
    } finally {
      // Освобождаем соединение
      connection.release();
    }
  },

  getDataById: async function (id, table, callback) {
    let dataById = {};
    try {
      let [data] = await db.query(`SELECT * FROM ${table} WHERE _id = ?`, [id]);
      dataById.order = data[0];
      dataById.date = data[0].date;
      dataById.accountNumber = data[0].accountNumber;
      [dataById.customer] = await db.query(`SELECT * FROM oders WHERE _id = ?`, [
        data[0].idCustomer,
      ]);
      [dataById.driver] = await db.query(`SELECT * FROM trackdrivers WHERE _id = ?`, [
        data[0].idTrackDriver,
      ]);
      if (data[0].idManager != null && data[0].idManager != '') {
        [dataById.manager] = await db.query(`SELECT * FROM clientmanager WHERE _id = ?`, [
          data[0].idManager,
        ]);
      }
      callback(dataById);
    } catch (err) {
      callback({ error: err });
    }
  },

  getDataBy_IdPromise: async function (id, table) {
    let dataById = {};
    try {
      let [data] = await db.query(`SELECT * FROM ${table} WHERE _id = ?`, [id]);
      dataById = data[0];
      return dataById;
    } catch (err) {
      throw err;
    }
  },
  getDataByIdPromise: async function (id, table) {
    let dataById = {};
    try {
      let [data] = await db.query(`SELECT * FROM ${table} WHERE id = ?`, [id]);
      dataById = data[0];
      return dataById;
    } catch (err) {
      throw err;
    }
  },

  del: async function (id, callback) {
    try {
      let [data] = await db.query(`SELECT * FROM oderslist WHERE _id = ?`, [id]);
      await db.query(`DELETE FROM oderslist WHERE _id = ?`, [id]);
      if (data[0].colorTR == 'hotpink')
        await db.query(`DELETE FROM addtable WHERE orderId = ?`, [id]);
      callback('Success!');
    } catch (err) {
      callback({ error: err });
    }
  },
  getDataFromTableById: async (id, table, callback) => {
    let dataFromTable = {};
    try {
      let [data] = await db.query(`SELECT * FROM ${table} WHERE _id = ?`, [id]);
      dataFromTable = data[0];
      callback(dataFromTable);
    } catch (err) {
      callback({ error: err });
    }
  },
  editField: async (id, table, field, newValue, callback) => {
    try {
      await db.query(`UPDATE ${table} SET ${field} = ? WHERE _id = ?`, [newValue, id]);
      callback('success!');
    } catch (err) {
      console.log(err);
      callback({ error: err });
    }
  },
  addOrderApp: async function (data, appId, callback) {
    console.log('addOrderApp', data, appId);
    data = JSON.parse(data);
    let oder = {
      date: data.date,
      idDriver: data.idDriver,
      idCustomer: data.idCustomer,
      idLoadingPoint: JSON.stringify(data.idLoadingPoint),
      idUnloadingPoint: JSON.stringify(data.idUnloadingPoint),
      customerPrice: data.customerPrice,
      driverPrice: data.driverPrice,
      idManager: data.idManager,
      idTrackDriver: data.idTrackDriver,
      idTrack: data.idTrack,
      loadingInfo: JSON.stringify(data.loadingInfo),
      unloadingInfo: JSON.stringify(data.unloadingInfo),
      completed: data.completed,
      applicationNumber: data.applicationNumber,
      colorTR: data.colorTR,
    };
    let addData = {
      customerId: data.idCustomer,
      sum: data.price,
      interest: data.interest,
      orderId: null,
    };
    if (oder.customerPrice === '') oder.customerPrice = null;
    if (oder.driverPrice === '') oder.driverPrice = null;
    try {
      let [data] = await db.query('INSERT INTO oderslist SET ?', oder);
      await db.query(`UPDATE customerorders SET orderId = ? WHERE _id = ?`, [data.insertId, appId]);
      addData.orderId = data.insertId;
      if (oder.colorTR == 'hotpink') {
        await db.query(`INSERT INTO addtable SET ?`, addData);
      }
      callback(data);
    } catch (err) {
      callback({ error: err });
    }
  },
};
module.exports = Tasks;
