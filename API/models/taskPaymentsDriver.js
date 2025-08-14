const mysql = require('mysql2');
const db = require('./db.js').promisePool;

var TaskPaymentsDriver = {
  add: async function (data, callback) {
    console.log(data);
    let listOfOders = JSON.stringify(data.chosenOders);
    let listOfDebts = JSON.stringify(data.chosenDebts);
    let sumChosenDebts = data.chosenDebts.reduce((sum, item) => sum + item.sum, 0);
    let paymentString = {
      date: new Date(),
      idDriver: data.id,
      sumOfPayment: data.currentDriverSumOfOders,
      listOfOders: listOfOders,
      sumOfDebts: sumChosenDebts,
      listOfDebts: listOfDebts,
    };
    console.log(paymentString);
    try {
      let check = true;
      for (let oderId of data.chosenOders) {
        let [data] = await db.query(`SELECT * FROM oderslist WHERE _id=?`, [oderId]);
        if (data[0].driverPayment == 'Ок') check = false;
      }
      if (check) {
        await db.query('INSERT INTO driverpayment SET ?', paymentString);
        for (let oderId of data.chosenOders) {
          await db.query(`UPDATE oderslist SET ? WHERE _id=?`, [
            { driverPayment: 'Ок', dateOfPayment: paymentString.date },
            oderId,
          ]);
        }
        for (let debt of data.chosenDebts) {
          let [chosenDebt] = await db.query(
            `SELECT sumOfDebt, paidPartOfDebt from driverdebts WHERE id=?`,
            [debt.id]
          );
          let sumOfDebt = Number(chosenDebt[0].sumOfDebt);
          let paidPart = Number(chosenDebt[0].paidPartOfDebt);
          if (sumOfDebt - paidPart == debt.sum) {
            await db.query(`UPDATE driverdebts SET paidPartOfDebt=0, debtClosed="Ок" WHERE id=?`, [
              debt.id,
            ]);
          } else {
            await db.query(
              `UPDATE driverdebts SET paidPartOfDebt=?, debtClosed="частично" WHERE id=?`,
              [paidPart + debt.sum, debt.id]
            );
          }
          console.log(chosenDebt[0], debt.sum);
        }
        callback(data);
      } else {
        throw new Error('Некоторые заказы уже оплачены обновите страницу');
      }
    } catch (err) {
      console.log(err);
      callback({ error: err });
    }
  },
};
module.exports = TaskPaymentsDriver;
