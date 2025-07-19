const mysql = require("mysql2");
const options = require("./config.js");

var TasksPayments = {
  list: async function (userId, callback) {
    const db = mysql.createPool(options.sql).promise();
    try {
      let [user] = await db.query(`SELECT * FROM users where _id=${userId}`);
      let ownerId = user[0].ownerId;
      let [data] = await db.query(
        `SELECT * FROM customerpayment where ownerId=${ownerId} order by date`
      );
      callback(data);
    } catch (err) {
      callback({ error: err });
    }
    db.end();
  },
  taskDeletePayments: async function (id, callback) {
    const db = mysql.createPool(options.sql).promise();
    try {
      let sum = 0;
      let [PaymentsData] = await db.query(
        `SELECT * FROM customerpayment where id=${id}`
      );
      console.log(PaymentsData[0]);
      for (const elem of PaymentsData[0].listOfOders) {
        let [odersData] = await db.query(
          `SELECT customerPrice, customerPayment, partialPaymentAmount FROM oderslist where _id=${elem.id}`
        );
        if (odersData[0].customerPrice == elem.customerPrice) {
          await db.query(
            `UPDATE oderslist SET customerPayment="Нет" WHERE _id=${elem.id}`
          );
        }
        if (odersData[0].customerPrice > elem.customerPrice) {
          if (odersData[0].customerPayment == "Ок") {
            await db.query(
              `UPDATE oderslist SET customerPayment="Частично оплачен", partialPaymentAmount=${
                odersData[0].customerPrice - elem.customerPrice
              } WHERE _id=${elem.id}`
            );
          }
          if (odersData[0].customerPayment == "Частично оплачен") {
            if (
              Number(odersData[0].partialPaymentAmount) - elem.customerPrice >
              0
            ) {
              await db.query(
                `UPDATE oderslist SET customerPayment="Частично оплачен", partialPaymentAmount=${
                  Number(odersData[0].partialPaymentAmount) - elem.customerPrice
                } WHERE _id=${elem.id}`
              );
            } else {
              await db.query(
                `UPDATE oderslist SET customerPayment="Нет", partialPaymentAmount=${null} WHERE _id=${
                  elem.id
                }`
              );
            }
          }
        }
        sum = sum + elem.customerPrice;
      }
      let [extraPay] = await db.query(
        `SELECT extraPayments FROM oders where _id=${PaymentsData[0].idCustomer}`
      );
      if (PaymentsData[0].sumOfPayment == sum) {
        await db.query(
          `DELETE FROM customerpayment WHERE id=${PaymentsData[0].id}`
        );
      }
      let diff = PaymentsData[0].sumOfPayment - sum;
      if (diff > 0) {
        await db.query(
          `DELETE FROM customerpayment WHERE id=${PaymentsData[0].id}`
        );
        await db.query(
          `UPDATE oders set extraPayments=${
            extraPay[0].extraPayments - diff
          } WHERE _id=${PaymentsData[0].idCustomer}`
        );
      }
      if (diff < 0) {
        await db.query(
          `DELETE FROM customerpayment WHERE id=${PaymentsData[0].id}`
        );
        await db.query(
          `UPDATE oders set extraPayments=${
            extraPay[0].extraPayments - diff
          } WHERE _id=${PaymentsData[0].idCustomer}`
        );
      }
      callback("success");
    } catch (err) {
      callback({ error: err });
    }
    db.end();
  },
};

module.exports = TasksPayments;
