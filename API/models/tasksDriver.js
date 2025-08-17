const db = require('./db.js').promisePool;
//const { getDriverPayments } = require("../controlers/driverAPI.js");

let TasksDriver = {
  getDriverPayments: async callBack => {
    console.log('dataDriverPayment');
    try {
      let [data] = await db.query(`SELECT * FROM driverpayment`);
      callBack(data);
    } catch (err) {
      callBack({ error: err });
    } finally {
    }
  },
  delDriverPayment: async (id, callBack) => {
    console.log(id);
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();
      let [payment] = await connection.query(`SELECT * FROM driverpayment where id=?`, [id]);
      let listOfOrder = payment[0].listOfOders;
      let listOdDebtsInfo = payment[0].listOfDebts;
      await connection.query(`DELETE FROM driverpayment where id=?`, [id]);
      for (const id of listOfOrder) {
        await connection.query(`UPDATE oderslist SET driverPayment="нет" where _id=?`, [id]);
      }
      for (const debtInfo of listOdDebtsInfo) {
        let [debt] = await connection.query(`SELECT * FROM driverdebts where id=?`, [debtInfo.id]);
        if (debt[0].sumOfDebt == debtInfo.sum) {
          await connection.query(
            `UPDATE driverdebts SET debtClosed="нет", paidPartOfDebt=NULL where id=?`,
            [debtInfo.id]
          );
        } else {
          let paidPartOfDebt = debt[0].paidPartOfDebt - debtInfo.sum;
          if (paidPartOfDebt == 0) {
            await connection.query(
              `UPDATE driverdebts SET debtClosed="нет", paidPartOfDebt=NULL where id=?`,
              [debtInfo.id]
            );
          } else {
            await connection.query(
              `UPDATE driverdebts SET debtClosed="частично", paidPartOfDebt=? where id=?`,
              [paidPartOfDebt, debtInfo.id]
            );
          }
        }
      }
      await connection.commit();
      callBack('success!');
    } catch (err) {
      await connection.rollback();
      callBack({ error: err });
    } finally {
      connection.release();
    }
  },
};

module.exports = TasksDriver;
