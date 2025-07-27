const mysql = require("mysql2");
const options = require("./config.js");

//const pool = mysql.createPool(options.sql).promise();
const nativePool = mysql.createPool(options.sql);
const promisePool = nativePool.promise(); 

module.exports = {
  nativePool,  // для мониторинга
  promisePool, // для использования в логике
};
