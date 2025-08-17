const db = require('./db.js').promisePool;

var TasksPayments = {
  list: async function (userId, callback) {
    try {
      let [user] = await db.query(`SELECT * FROM users where _id=?`, [userId]);
      let ownerId = user[0].ownerId;
      let [data] = await db.query(`SELECT * FROM customerpayment where ownerId=? order by date`, [
        ownerId,
      ]);
      callback(data);
    } catch (err) {
      callback({ error: err });
    }
  },
  taskDeletePayments: async function (id, callback) {
    try {
      let sum = 0;
      let [PaymentsData] = await db.query(`SELECT * FROM customerpayment where id=?`, [id]);
      console.log(PaymentsData[0]);
      for (const elem of PaymentsData[0].listOfOders) {
        let [odersData] = await db.query(
          `SELECT customerPrice, customerPayment, partialPaymentAmount FROM oderslist where _id=?`,
          [elem.id]
        );
        if (odersData[0].customerPrice == elem.customerPrice) {
          await db.query(`UPDATE oderslist SET customerPayment="Нет" WHERE _id=?`, [elem.id]);
        }
        if (odersData[0].customerPrice > elem.customerPrice) {
          if (odersData[0].customerPayment == 'Ок') {
            await db.query(
              `UPDATE oderslist SET customerPayment="Частично оплачен", partialPaymentAmount=? WHERE _id=?`,
              [odersData[0].customerPrice - elem.customerPrice, elem.id]
            );
          }
          if (odersData[0].customerPayment == 'Частично оплачен') {
            if (Number(odersData[0].partialPaymentAmount) - elem.customerPrice > 0) {
              await db.query(
                `UPDATE oderslist SET customerPayment="Частично оплачен", partialPaymentAmount=? WHERE _id=?`,
                [Number(odersData[0].partialPaymentAmount) - elem.customerPrice, elem.id]
              );
            } else {
              await db.query(
                `UPDATE oderslist SET customerPayment="Нет", partialPaymentAmount=? WHERE _id=?`,
                [null, elem.id]
              );
            }
          }
        }
        sum = sum + elem.customerPrice;
      }
      let [extraPay] = await db.query(`SELECT extraPayments FROM oders where _id=?`, [
        PaymentsData[0].idCustomer,
      ]);
      if (PaymentsData[0].sumOfPayment == sum) {
        await db.query(`DELETE FROM customerpayment WHERE id=?`, [PaymentsData[0].id]);
      }
      let diff = PaymentsData[0].sumOfPayment - sum;
      if (diff > 0) {
        await db.query(`DELETE FROM customerpayment WHERE id=?`, [PaymentsData[0].id]);
        await db.query(`UPDATE oders set extraPayments=? WHERE _id=?`, [
          extraPay[0].extraPayments - diff,
          PaymentsData[0].idCustomer,
        ]);
      }
      if (diff < 0) {
        await db.query(`DELETE FROM customerpayment WHERE id=?`, [PaymentsData[0].id]);
        await db.query(`UPDATE oders set extraPayments=? WHERE _id=?`, [
          extraPay[0].extraPayments - diff,
          PaymentsData[0].idCustomer,
        ]);
      }
      callback('success');
    } catch (err) {
      callback({ error: err });
    }
  },
};

module.exports = TasksPayments;
