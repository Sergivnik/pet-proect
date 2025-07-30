const mysql = require("mysql2");
const db = require('./db.js').promisePool;

var TasksContractors = {
  list: async function (callback) {
    let dataObj = {};
    try {
      let [data] = await db.query("SELECT * FROM contractors order by value");
      dataObj.contractors = data;
      [data] = await db.query(
        "SELECT * FROM contractorspayments order by date"
      );
      dataObj.contractorsPayments = data;
      callback(dataObj);
    } catch (err) {
      callback({ error: err });
    }
  },
  add: async function (data, callback) {
    console.log(data);
    try {
      let [contractorPayment] = await db.query(
        "INSERT INTO contractorspayments SET ?",
        data
      );
      callback(contractorPayment.insertId);
    } catch (err) {
      console.log(err);
      callback({ error: err });
    }
  },
  delete: async function (id, callback) {
    console.log(id);
    try {
      let [data] = await db.query(
        `DELETE FROM contractorspayments WHERE id=${id}`
      );
      callback("success!");
    } catch (err) {
      console.log(err);
      callback({ error: err });
    }
  },
};

module.exports = TasksContractors;
