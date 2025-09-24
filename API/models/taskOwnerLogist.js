const mysql = require('mysql2');
const db = require('./db.js').promisePool;
const TasksUser = require('./taskUser.js');

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

  add: async function (newData, callback) {
    let connection;
    try {
      connection = await db.getConnection();
      await connection.beginTransaction();

      // Подготовка данных для пользователя и ownerlogist
      let newUser = {
        login: newData.login,
        password: newData.password,
        name: newData.bossName,
        role: 'admin',
      };

      // Убираем поля пользователя из данных для таблицы ownerlogist
      let ownerlogistData = { ...newData };
      delete ownerlogistData.login;
      delete ownerlogistData.password;

      // Вставка ownerlogist
      console.log('ownerlogistData:', ownerlogistData);
      let [insertResult] = await connection.query('INSERT INTO ownerlogist SET ?', ownerlogistData);

      // Создание пользователя, привязанного к новому ownerlogist
      newUser.ownerId = insertResult.insertId;
      await TasksUser.addNewUser(newUser, undefined, () => {});

      // Инициализация записей в yearconst для нового owner
      let newYearConst = {
        lastyeartaxdebt: 0,
        taxadvance: 0,
        fixedincometax: 0,
        deposit: 0,
        ownerId: insertResult.insertId,
      };
      await connection.query('INSERT INTO yearconst SET ?', newYearConst);

      await connection.commit();
      callback(insertResult);
    } catch (err) {
      if (connection) await connection.rollback();
      console.log(err);
      callback({ error: err });
    } finally {
      if (connection) connection.release();
    }
  },

  edit: async function (data, callback) {
    try {
      await db.query(`UPDATE ownerlogist SET ??=? WHERE _id=?`, [
        data.editField,
        data.newValue,
        data.id,
      ]);
      callback('success');
    } catch (err) {
      callback({ error: err });
    }
  },

  delete: async function (id, callback) {
    let connection;
    try {
      connection = await db.getConnection();
      await connection.beginTransaction();

      let check = 0;

      let [data] = await connection.query(`SELECT * FROM oderslist WHERE ownerId=?`, [id]);
      check = data.length;

      [data] = await connection.query(`SELECT * FROM tracklist WHERE ownerId=?`, [id]);
      check = check + data.length;

      [data] = await connection.query(`SELECT * FROM trackdrivers WHERE ownerId=?`, [id]);
      check = check + data.length;

      [data] = await connection.query(`SELECT * FROM customerclients WHERE ownerId=?`, [id]);
      check = check + data.length;

      [data] = await connection.query(`SELECT * FROM customerorders WHERE ownerId=?`, [id]);
      check = check + data.length;

      [data] = await connection.query(`SELECT * FROM customerpayment WHERE ownerId=?`, [id]);
      check = check + data.length;

      [data] = await connection.query(`SELECT * FROM clientmanager WHERE ownerId=?`, [id]);
      check = check + data.length;

      [data] = await connection.query(`SELECT * FROM drivers WHERE ownerId=?`, [id]);
      check = check + data.length;

      [data] = await connection.query(`SELECT * FROM incomereport WHERE ownerId=?`, [id]);
      check = check + data.length;

      [data] = await connection.query(`SELECT * FROM oders WHERE ownerId=?`, [id]);
      check = check + data.length;

      [data] = await connection.query(`SELECT * FROM storelist WHERE ownerId=?`, [id]);
      check = check + data.length;

      [data] = await connection.query(`SELECT * FROM taskstable WHERE ownerId=?`, [id]);
      check = check + data.length;

//      [data] = await connection.query(`SELECT * FROM users WHERE ownerId=?`, [id]);
//      check = check + data.length;

      [data] = await connection.query(`SELECT * FROM cardpayment WHERE ownerId=?`, [id]);
      check = check + data.length;

      if (check == 0) {
        await connection.query(`DELETE FROM yearconst WHERE ownerId=?`, [id]);
        await connection.query(`DELETE FROM users WHERE ownerId=?`, [id]);
        await connection.query(`DELETE FROM ownerlogist WHERE id=?`, [id]);
        await connection.commit();
        callback('success!');
      } else {
        await connection.rollback();
        callback({
          error: 'Данного клиента нельзя удалить, так как существуют связанные записи',
          NoErr: 'userErr1',
        });
      }
    } catch (err) {
      if (connection) await connection.rollback();
      console.log('Error in delete for ownerlogist:', err);
      callback({ error: err });
    } finally {
      if (connection) connection.release();
    }
  },
};

module.exports = TasksOwnerLogist;
