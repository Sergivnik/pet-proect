const mysql = require('mysql2');
const db = require('./db.js').promisePool;

let TasksCard = {
  makeCardPayment: async (data, callBack) => {
    console.log(data);
    let sumOfDriverDebts = 0;
    let sumOfCustomerDebts = 0;
    let driverPaymentId, customerPaymentId;
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      if (data.driverDebtsId.length > 0) {
        let placeholders = data.driverDebtsId.map(() => '?').join(',');
        let [listDriverDebts] = await connection.query(
          `SELECT * FROM driverdebts where id in (${placeholders})`,
          data.driverDebtsId
        );
        sumOfDriverDebts = listDriverDebts.reduce((sum, debt) => sum + Number(debt.sumOfDebt), 0);
        console.log(sumOfDriverDebts);
      }

      if (data.customerDebtsId.length > 0) {
        let placeholders = data.customerDebtsId.map(() => '?').join(',');
        let [listOfCustomerDebts] = await connection.query(
          `SELECT sum,interest,customerPrice FROM addtable, oderslist where _id=orderId and id in (${placeholders})`,
          data.customerDebtsId
        );
        sumOfCustomerDebts = listOfCustomerDebts.reduce(
          (sum, debt) =>
            sum + ((Number(debt.customerPrice) - debt.sum) * (100 - debt.interest)) / 100,
          0
        );
        console.log(sumOfCustomerDebts);
      }

      let now = new Date();
      let Year = String(now.getFullYear());
      let Month = String(now.getMonth() + 1);
      let Day = String(now.getDate());
      let cardPayment = {
        date: Year + '-' + (Month <= 9 ? '0' + Month : Month) + '-' + (Day <= 9 ? '0' + Day : Day),
        sumOfPayment: sumOfDriverDebts + sumOfCustomerDebts,
        listOfDebts: JSON.stringify(data),
      };

      if (data.driverDebtsId.length > 0 || data.customerDebtsId.length > 0) {
        console.log(cardPayment.date, cardPayment.sumOfPayment, '${cardPayment.listOfDebts}');
        await connection.query(`INSERT INTO cardpayment set ?`, cardPayment);
      }

      if (data.driverDebtsId.length > 0) {
        let placeholders = data.driverDebtsId.map(() => '?').join(',');
        await connection.query(
          `UPDATE driverdebts set card=1 where id in (${placeholders})`,
          data.driverDebtsId
        );
        let [dataId] = await connection.query(
          `INSERT contractorspayments(idContractor,date,sum,category) VALUES (?,?,?,?)`,
          [5, cardPayment.date, sumOfDriverDebts, 2]
        );
        driverPaymentId = dataId.insertId;
      }

      if (data.customerDebtsId.length > 0) {
        let placeholders = data.customerDebtsId.map(() => '?').join(',');
        await connection.query(
          `UPDATE addtable set card=1 where id in (${placeholders})`,
          data.customerDebtsId
        );
        let [dataId] = await connection.query(
          `INSERT contractorspayments(idContractor,date,sum,category) VALUES (?,?,?,?)`,
          [5, cardPayment.date, sumOfCustomerDebts, 3]
        );
        customerPaymentId = dataId.insertId;
      }

      await connection.commit();

      callBack({
        sumOfDriverDebts: sumOfDriverDebts,
        sumOfCustomerDebts: sumOfCustomerDebts,
        driverPaymentId: driverPaymentId,
        customerPaymentId: customerPaymentId,
      });
    } catch (err) {
      await connection.rollback();
      callBack({ error: err });
    } finally {
      connection.release();
    }
    //db.end();
  },
};

module.exports = TasksCard;
