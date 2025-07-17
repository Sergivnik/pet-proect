const mysql = require('mysql2');
const options = require('./config.js');

var TaskDebts = {
  list: async function (userId, callback) {
    const db = mysql.createPool(options.sql).promise();
    try {
      let [owner] = await db.query(`SELECT ownerId FROM users WHERE _id=${userId}`);
      console.log(owner[0].ownerId);
      let ownerId = owner[0].ownerId;
      let [data] = await db.query(
        `SELECT * FROM driverdebts WHERE ownerId=${ownerId} order by date`
      );
      callback(data);
    } catch (err) {
      callback({ error: err });
    }
    db.end();
  },
  makeDriverDebt: async function (data, callback) {
    let debt = {
      date: data.date,
      idDriver: data.idDriver,
      category: data.idCategory,
      sumOfDebt: data.sumOfDebt,
      debtClosed: data.idDebtClosed,
      addInfo: data.addInfo,
    };
    const db = mysql.createPool(options.sql).promise();
    try {
      let [debtData] = await db.query('INSERT INTO driverdebts SET ?', debt);
      console.log(debtData.insertId);
      callback(debtData.insertId);
    } catch (err) {
      callback({ error: err });
    }
    db.end();
  },
  edit: async function (data, callback) {
    console.log(`UPDATE driverdebts SET ${data.editField}=${data.newValue} WHERE id=${data.id}`);
    const db = mysql.createPool(options.sql).promise();
    try {
      await db.query(
        `UPDATE driverdebts SET ${data.editField}="${data.newValue}" WHERE id=${data.id}`
      );
      callback('success');
    } catch (err) {
      callback({ error: err });
    }
    db.end();
  },
  del: async function (id, callback) {
    console.log(id);
    const db = mysql.createPool(options.sql).promise();
    try {
      await db.query(`DELETE FROM driverdebts WHERE id=${id}`);
      callback('success');
    } catch (err) {
      callback({ error: err });
    }
    db.end();
  },
};
module.exports = TaskDebts;
