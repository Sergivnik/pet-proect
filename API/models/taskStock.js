const db = require('./db.js').promisePool;

let TaskStock = {
  getStockData: async (userId, callBack) => {
    try {
      let stackData = {};
      let [data] = await db.query(`SELECT * FROM users where _id = ?`, [userId]);
      let userRole = data[0].role;
      if (userRole == 'admin') {
        [data] = await db.query(`SELECT * FROM stock_transactions`);
        stackData.stock_transactions = data;
        [data] = await db.query(`SELECT * FROM stocks`);
        stackData.stock = data;
        callBack(stackData);
      } else {
        callBack({
          error: true,
          message: 'Роль пользователя не admin',
        });
      }
    } catch (err) {
      console.log(err);
      callBack({ error: err, message: 'failure' });
    }
  },
};
module.exports = TaskStock;
