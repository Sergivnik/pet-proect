const mysql = require('mysql2');
const db = require('./db.js').promisePool;

var TasksOwnerLogist = {
  list: async function (callback) {
    try {
      let [data] = await db.query('SELECT * FROM ownerlogist ORDER BY nameOwner');
      console.log('ownerlogist', data);
      callback(data);
    } catch (err) {
      callback({ error: err });
    }
  },

  add: async function (data, callback) {
    try {
      let [result] = await db.query('INSERT INTO ownerlogist SET ?', data);
      callback(result.insertId);
    } catch (err) {
      console.log(err);
      callback({ error: err });
    }
  },

  edit: async function (data, callback) {
    try {
      await db.query(
        `UPDATE ownerlogist SET ${data.editField}="${data.newValue}" WHERE _id=${data.id}`
      );
      callback('success');
    } catch (err) {
      callback({ error: err });
    }
  },

  delete: async function (id, callback) {
    try {
      await db.query(`DELETE FROM ownerlogist WHERE _id=${id}`);
      callback('success!');
    } catch (err) {
      console.log(err);
      callback({ error: err });
    }
  },
};

module.exports = TasksOwnerLogist;
