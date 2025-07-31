const db = require('./db.js').promisePool;

let customerTasks = {
  getData: async (userId, callBack) => {
    console.log(userId);
    let allData = {};
    try {
      let [user] = await db.query(`SELECT * FROM users WHERE _id = ?`, [userId]);
      user = user[0];
      console.log(user.customerId);
      let whereCondition = `WHERE idCustomer = ?`;
      let whereParams = [user.customerId];
      if (user.role == 'admin') {
        whereCondition = '';
        whereParams = [];
      }
      let listOfColumns =
        'oderslist._id, date, oderslist.idLoadingPoint, oderslist.idUnloadingPoint, oderslist.customerPrice, document, customerPayment, accountNumber, oderslist.idTrackDriver, oderslist.idTrack, oderslist.idManager, oderslist.loadingInfo, oderslist.unloadingInfo, oderslist.applicationNumber,customerClientId,textInfo';
      let data = [];
      if (user.role == 'customerBoss' || user.role == 'admin') {
        [data] = await db.query(
          `(SELECT ${listOfColumns} FROM oderslist left join customerorders on customerorders.orderId=oderslist._id ${whereCondition} ORDER BY _id DESC LIMIT 1000) ORDER BY date, accountNumber, _id`,
          whereParams
        );
      } else {
        [data] = await db.query(
          `(SELECT ${listOfColumns} FROM oderslist left join customerorders on customerorders.orderId=oderslist._id WHERE idCustomer = ? and oderslist.idManager = ? ORDER BY _id DESC LIMIT 1000) ORDER BY date, accountNumber, _id`,
          [user.customerId, user.managerID]
        );
      }
      allData.ordersList = data;
      if (user.role == 'customerBoss' || user.role == 'admin') {
        [data] = await db.query(
          `SELECT * FROM trackdrivers WHERE _id in (SELECT distinct idTrackDriver FROM oderslist ${whereCondition})`,
          whereParams
        );
      } else {
        [data] = await db.query(
          `SELECT * FROM trackdrivers WHERE _id in (SELECT distinct idTrackDriver FROM oderslist WHERE idCustomer = ? and idManager = ?)`,
          [user.customerId, user.managerID]
        );
      }
      allData.driversList = data;
      if (user.role == 'customerBoss' || user.role == 'admin') {
        [data] = await db.query(
          `SELECT * FROM tracklist WHERE _id in (SELECT distinct idTrack FROM oderslist ${whereCondition})`,
          whereParams
        );
      } else {
        [data] = await db.query(
          `SELECT * FROM tracklist WHERE _id in (SELECT distinct idTrack FROM oderslist WHERE idCustomer = ? and idManager = ?)`,
          [user.customerId, user.managerID]
        );
      }
      allData.trackList = data;
      [data] = await db.query(`SELECT * FROM oders WHERE _id = ?`, [user.customerId]);
      console.log(data);
      if (user.role != 'admin') {
        allData.customerData = data[0];
      } else {
        allData.customerData = {
          _id: 5000,
          value: 'Админстратор',
          companyName: 'Админстратор',
        };
      }
      if (user.role != 'admin') {
        [data] = await db.query(`SELECT * FROM clientmanager WHERE odersId = ?`, [
          user.customerId,
        ]);
      } else {
        [data] = await db.query(`SELECT * FROM clientmanager`);
      }
      allData.managerList = data;
      if (user.role != 'admin') {
        [data] = await db.query(`SELECT _id, name, role FROM users WHERE customerId = ?`, [
          user.customerId,
        ]);
      } else {
        [data] = await db.query(`SELECT _id, name, role FROM users`);
      }
      allData.userList = data;
      [data] = await db.query(`SELECT * FROM cities`);
      allData.citiesList = data;
      [data] = await db.query(`SELECT * FROM storelist`);
      allData.storelist = data;
      if (user.role != 'customerBoss') {
        [data] = await db.query(
          `SELECT * FROM customerorders WHERE customerId = ? and idManager = ?`,
          [user.customerId, user.managerID]
        );
      } else {
        [data] = await db.query(`SELECT * FROM customerorders WHERE customerId = ?`, [
          user.customerId,
        ]);
      }
      allData.customerOrders = data;
      if (user.role != 'admin') {
        [data] = await db.query(`SELECT * FROM customerclients WHERE orderId = ?`, [
          user.customerId,
        ]);
      } else {
        [data] = await db.query(`SELECT * FROM customerclients`);
      }
      allData.customerclients = data;
      callBack(allData);
    } catch (err) {
      callBack({ error: err });
    }
  },
  addCustomerApp: async (dataApp, callBack) => {
    console.log('dataApp', dataApp);
    let date = new Date(dataApp.dateOfApp);
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    dateText = `${year}-${month < 9 ? `0${month + 1}` : `${month + 1}`}-${
      day < 10 ? `0${day}` : `${day}`
    }`;
    let customerApp = {
      dateOfApp: dateText,
      customerClientId: dataApp.customerClientId,
      weight: dataApp.weight,
      idLoadingPoint: JSON.stringify(dataApp.idLoadingPoint),
      idUnloadingPoint: JSON.stringify(dataApp.idUnloadingPoint),
      loadingInfo: JSON.stringify(dataApp.loadingInfo),
      unloadingInfo: JSON.stringify(dataApp.unloadingInfo),
      dateOfLoading: JSON.stringify(dataApp.dateOfLoading),
      dateOfUnloading: JSON.stringify(dataApp.dateOfUnloading),
      loadingStoreId: JSON.stringify(dataApp.loadingStoreId),
      unloadingStoreId: JSON.stringify(dataApp.unloadingStoreId),
      customerPrice: dataApp.customerPrice,
      textInfo: dataApp.textInfo,
      orderId: dataApp.orderId,
      customerId: dataApp.customerId,
      idManager: dataApp.idManager,
      applicationNumber: dataApp.applicationNumber,
      loadingText: JSON.stringify(dataApp.loadingText),
      unloadingText: JSON.stringify(dataApp.unloadingText),
      idDriver: dataApp.idDriver,
      idTrackDriver: dataApp.idTrackDriver,
      idTrack: dataApp.idTrack,
    };
    try {
      let [data] = await db.query(`INSERT INTO customerorders SET ?`, [customerApp]);
      callBack(data);
    } catch (err) {
      callBack({ error: err });
    }
  },
  editCustomerApp: async (data, callBack) => {
    console.log(data);
    let dataApp = data.appData;
    let date = new Date(dataApp.dateOfApp);
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    dateText = `${year}-${month < 9 ? `0${month + 1}` : `${month + 1}`}-${
      day < 10 ? `0${day}` : `${day}`
    }`;
    let customerApp = {
      dateOfApp: dateText,
      customerClientId: dataApp.customerClientId,
      weight: dataApp.weight,
      idLoadingPoint: JSON.stringify(dataApp.idLoadingPoint),
      idUnloadingPoint: JSON.stringify(dataApp.idUnloadingPoint),
      loadingInfo: JSON.stringify(dataApp.loadingInfo),
      unloadingInfo: JSON.stringify(dataApp.unloadingInfo),
      dateOfLoading: JSON.stringify(dataApp.dateOfLoading),
      dateOfUnloading: JSON.stringify(dataApp.dateOfUnloading),
      loadingStoreId: JSON.stringify(dataApp.loadingStoreId),
      unloadingStoreId: JSON.stringify(dataApp.unloadingStoreId),
      customerPrice: dataApp.customerPrice,
      textInfo: dataApp.textInfo,
      orderId: dataApp.orderId,
      customerId: dataApp.customerId,
      idManager: dataApp.idManager,
      applicationNumber: dataApp.applicationNumber,
      loadingText: JSON.stringify(dataApp.loadingText),
      unloadingText: JSON.stringify(dataApp.unloadingText),
      idDriver: dataApp.idDriver,
      idTrackDriver: dataApp.idTrackDriver,
      idTrack: dataApp.idTrack,
    };
    try {
      await db.query(`UPDATE customerorders SET ? WHERE _id = ?`, [customerApp, data.id]);
      callBack('success!');
    } catch (err) {
      callBack({ error: err });
    }
  },
  delCustomerApp: async (id, callBack) => {
    console.log(id);
    try {
      await db.query(`DELETE FROM customerorders WHERE _id = ?`, [id]);
      callBack('success!');
    } catch (err) {
      console.log(err);
      callBack({ error: err });
    }
  },
  getNewApp: async callBack => {
    try {
      let [data] = await db.query(`SELECT * FROM customerorders`);
      callBack(data.length);
    } catch (err) {
      console.log(err);
      callBack({ error: err, message: 'failure' });
    }
  },
  getApps: async callBack => {
    let allData = {};
    try {
      let data = [];
      [data] = await db.query(`SELECT * FROM customerorders`);
      allData.ordersList = data;
      [data] = await db.query(`SELECT * FROM trackdrivers`);
      allData.driversList = data;
      [data] = await db.query(`SELECT * FROM tracklist`);
      allData.trackList = data;
      [data] = await db.query(`SELECT * FROM clientmanager`);
      allData.managerList = data;
      [data] = await db.query(`SELECT * FROM cities`);
      allData.citiesList = data;
      [data] = await db.query(`SELECT * FROM storelist`);
      allData.storelist = data;
      callBack(allData);
    } catch (err) {
      console.log(err);
      callBack({ error: err, message: 'failure' });
    }
  },
};
module.exports = customerTasks;
