const mysql = require('mysql2');
const options = require('./config.js');

var TasksOwnerLogist = {
  list: async function (callback) {
    const db = mysql.createPool(options.sql).promise();
    try {
      let [data] = await db.query('SELECT * FROM ownerlogist ORDER BY nameOwner');
      console.log('ownerlogist', data);
      callback(data);
    } catch (err) {
      callback({ error: err });
    }
    db.end();
  },

  add: async function (data, callback) {
    const db = mysql.createPool(options.sql).promise();
    try {
      let [result] = await db.query('INSERT INTO ownerlogist SET ?', data);
      callback(result.insertId);
    } catch (err) {
      console.log(err);
      callback({ error: err });
    }
    db.end();
  },

  edit: async function (data, callback) {
    const db = mysql.createPool(options.sql).promise();
    try {
      await db.query(
        `UPDATE ownerlogist SET ${data.editField}="${data.newValue}" WHERE _id=${data.id}`
      );
      callback('success');
    } catch (err) {
      callback({ error: err });
    }
    db.end();
  },

  delete: async function (id, callback) {
    const db = mysql.createPool(options.sql).promise();
    try {
      await db.query(`DELETE FROM ownerlogist WHERE _id=${id}`);
      callback('success!');
    } catch (err) {
      console.log(err);
      callback({ error: err });
    }
    db.end();
  },
};

module.exports = TasksOwnerLogist;
