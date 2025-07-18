const mysql = require("mysql2");
const Mail = require("nodemailer/lib/mailer");
const options = require("./config.js");
//const email = require("./configEmail.js");

let TasksReports = {
  reconciliation: async function (data, callBack) {
    console.log(data);
    let obj = {};
    let idFilter = null;
    let tableName = "";
    if (data.name == "customer") {
      tableName = "customerpayment";
      idFilter = `idCustomer=${data.id}`;
    }
    if (data.name == "driver") {
      tableName = "driverpayment";
      idFilter = `idDriver=${data.id}`;
    }
    let dateBegin = data.dateBegin.slice(0, 10);
    console.log(dateBegin);
    const db = mysql.createPool(options.sql).promise();
    try {
      let [dataPayment] = await db.query(
        `SELECT * FROM ${tableName} where ${idFilter} and date>="${dateBegin}"`
      );
      obj.payments = dataPayment;
      let [dataOrder] = await db.query(
        `SELECT * FROM oderslist where ${idFilter} and date>="${dateBegin}"`
      );
      obj.orders = dataOrder;
      if (data.name == "customer") {
        let [debt] = await db.query(
          `SELECT SUM(customerPrice) as "debt" FROM oderslist where ${idFilter} and customerPayment!="Ок"`
        );
        obj.clearDebt = debt;
        [debt] = await db.query(
          `SELECT SUM(partialPaymentAmount) as "debt" FROM oderslist where ${idFilter} and customerPayment="Частично оплачен"`
        );
        obj.partDebt = debt;
        [debt] = await db.query(
          `SELECT SUM(extraPayments) as "debt"  FROM oders where _id=${data.id}`
        );
        obj.extraPayments = debt;
      }
      if (data.name == "driver") {
        let [debt] = await db.query(
          `SELECT SUM(driverPrice) as "debt" FROM oderslist where ${idFilter} and driverPayment!="Ок"`
        );
        obj.clearDebt = debt;
        obj.partDebt = [{ debt: 0 }];
        obj.extraPayments = [{ debt: 0 }];
      }
      callBack(obj);
    } catch (err) {
      callback({ error: err });
    }
    db.end();
  },
  reconciliationSavePdf: async (data, callBack) => {
    console.log("save report to pdf");
    const puppeteer = require("puppeteer");
    let fs = require("fs");
    try {
      (async () => {
        const browser = await puppeteer.launch({
          args: ["--no-sandbox"],
        });
        const page = await browser.newPage();
        await page.setContent(data);
        await page.pdf({ path: `./API/Bills/tempDoc.pdf`, format: "a4" });
        await browser.close();
        callBack("success!");
      })();
    } catch (err) {
      callBack({ error: err });
    }
  },
  editYearConst: async (data, userId, callBack) => {
    console.log(data);
    const db = mysql.createPool(options.sql).promise();
    try {
      let [user] = await db.query(`SELECT * FROM users where _id=${userId}`);
      let ownerId = user[0].ownerId;
      await db.query(
        `UPDATE yearconst SET ${data.name}=${data.data} WHERE ownerId=${ownerId}`
      );
      callBack("success!");
    } catch (err) {
      callBack({ error: err });
    }
    db.end();
  },
  sendEmail: async (email, callBack) => {
    console.log("send report to Email");
    const configEmail = require("../models/config.js");
    const nodemailer = require("nodemailer");
    email = email + ", sergivnik@mail.ru";
    console.log(email);

    try {
      async function main() {
        let transporter = nodemailer.createTransport(configEmail.email);
        let attachmentFiles = [
          {
            path: `./API/Bills/tempDoc.pdf`,
          },
        ];
        let info = await transporter.sendMail({
          from: '"ИП Иванов Сергей" <sergivnik@mail.ru>', // sender address
          to: email, // list of receivers
          subject: "Акт сверки ИП Иванов С.Н.", // Subject line

          html: "<b>ИП Иванов С.Н. тел. +7-991-366-13-66</b>", // html body
          attachments: attachmentFiles,
        });
      }
      main().then(callBack("success!"));
    } catch (err) {
      callBack({ error: err });
    }
  },
};

module.exports = TasksReports;
