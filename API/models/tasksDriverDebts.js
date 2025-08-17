const db = require('./db.js').promisePool;

var TaskDebts = {
  list: async function (userId, callback) {
    try {
      let [owner] = await db.query(`SELECT ownerId FROM users WHERE _id=?`, [userId]);
      console.log(owner[0].ownerId);
      let ownerId = owner[0].ownerId;
      let [data] = await db.query(`SELECT * FROM driverdebts WHERE ownerId=? order by date`, [
        ownerId,
      ]);
      callback(data);
    } catch (err) {
      callback({ error: err });
    }
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
    try {
      let [debtData] = await db.query('INSERT INTO driverdebts SET ?', debt);
      console.log(debtData.insertId);
      callback(debtData.insertId);
    } catch (err) {
      callback({ error: err });
    }
  },
  edit: async function (data, callback) {
    console.log(`UPDATE driverdebts SET ${data.editField}=${data.newValue} WHERE id=${data.id}`);
    try {
      await db.query(`UPDATE driverdebts SET ${data.editField}=? WHERE id=?`, [
        data.newValue,
        data.id,
      ]);
      callback('success');
    } catch (err) {
      callback({ error: err });
    }
  },
  del: async function (id, callback) {
    console.log(id);
    try {
      await db.query(`DELETE FROM driverdebts WHERE id=?`, [id]);
      callback('success');
    } catch (err) {
      callback({ error: err });
    }
  },
};
module.exports = TaskDebts;
