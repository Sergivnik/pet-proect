const express = require("express");
const path = require("path");
const router = require("./routers");

const app = express();
app.use(express.static(path.join(__dirname, "./public")));
app.use(express.static(path.join(__dirname, "documents")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);
// app.get("/*", (req, res) => {
//   res.sendFile(__dirname + "/public/index.html");
// });
// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
// const OderSchema = new Schema({
//   _id: Number,
//   date: String,
//   idDriver: Number,
//   idCustomer: Number,
//   idLoadingPoint: [],
//   idUnloadingPoint: [],
//   customerPrice: Number,
//   driverPrice: Number,
//   proxy: Boolean,
// });
// const DriverSchema = new Schema({
//   _id: Number,
//   value: String,
// });
// const CustomerSchema = new Schema({
//   _id: Number,
//   value: String,
// });
// const CitiesSchema = new Schema({
//   _id: Number,
//   value: String,
// });
// var XLSX = require("xlsx");
// var workbook = XLSX.readFile("./DB/Колдовство.xlsb");
// var sheet_name_list = workbook.SheetNames;
// var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
// console.log(xlData);
// mongoose.connect("mongodb://localhost:27017/pet_proect", {
//   useUnifiedTopology: true,
//   useNewUrlParser: true,
// });
// const Oder = mongoose.model("Oder", OderSchema);
// const Driver = mongoose.model("Driver", DriverSchema);
// const Customer = mongoose.model("Customer", CustomerSchema);
// const City = mongoose.model("Citie", CitiesSchema);
// const getData = async function (callback) {
//   let data = {};
//   await Driver.find({}, function (err, res) {
//     if (err) return console.log(err);
//     console.log(res);
//     data.driver = res;
//   });
//   await Customer.find({}, function (err, res) {
//     if (err) return console.log(err);
//     console.log(res);
//     data.customer = res;
//   });
//   await City.find({}, function (err, res) {
//     if (err) return console.log(err);
//     console.log(res);
//     data.cities = res;
//   });
//   callback(data);
// };
// getData((dataList) => {
//   console.log(dataList);
//   (async () => {
//     let i = 1;
//     for (const elem of xlData) {
//       i = elem.id;
//       dateOd = new Date(1900, 0, 1);
//       dateOd.setDate(dateOd.getDate() + elem.Дата - 2);
//       dateOd = dateOd.toLocaleDateString();
//       res = dataList.driver.find((item) => item.value == elem.Колдун);
//       if (res) {
//         idDr = res.id;
//       } else {
//         idDr = null;
//       }
//       res = dataList.customer.find((item) => item.value == elem.Заказчик);
//       if (res) {
//         idOd = res.id;
//       } else {
//         idOd = null;
//       }
//       res = dataList.cities.find((item) => item.value == elem.пзагрузки);
//       if (res) {
//         idLP = res.id;
//       } else {
//         idLP = null;
//       }
//       res = dataList.cities.find((item) => item.value == elem.пвыгрузки);
//       if (res) {
//         idUP = res.id;
//       } else {
//         idUP = null;
//       }
//       CuPr = elem.Ставказаказчика;
//       DrPr = elem.Ставкаколдуна;

//       const oder = await new Oder({
//         _id: i,
//         date: dateOd,
//         idDriver: idDr,
//         idCustomer: idOd,
//         idLoadingPoint: [idLP],
//         idUnloadingPoint: [idUP],
//         customerPrice: CuPr,
//         driverPrice: DrPr,
//         proxy: false,
//       }).save();
//     }
//   })();
// });

// const mysql = require("mysql2");
// const options = require("./models/config.js");

// var XLSX = require("xlsx");
// var workbook = XLSX.readFile("./DB/Колдовство.xlsb");
// var sheet_name_list = workbook.SheetNames;
// var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
// console.log(xlData);
// let i = 0;
// const getDATA = async function (callback) {
//   let allData = {};
//   const db = mysql.createPool(options).promise();
//   try {
//     let [data] = await db.query("SELECT * FROM cities");
//     allData.citieslist = data;
//     [data] = await db.query("SELECT * FROM drivers");
//     allData.driverlist = data;
//     [data] = await db.query("SELECT * FROM oders");
//     allData.clientList = data;
//     [data] = await db.query("SELECT * FROM oderslist");
//     allData.odersList = data;
//     callback(allData);
//   } catch (err) {
//     return { error: err };
//   }
// };
// getDATA((datalists) => {
//   console.log(datalists);
//   let oder = {};
//   const db = mysql.createPool(options).promise();
//   (async () => {
//     for (const elem of xlData) {
//       i = elem.id;
//       dateOd = new Date(1900, 0, 1);
//       dateOd.setDate(dateOd.getDate() + elem.Дата - 2);
//       //dateOd = dateOd.toLocaleDateString();
//       let Year = dateOd.getFullYear();
//       let Month = dateOd.getMonth() + 1;
//       let Day = dateOd.getDate();
//       dateOd = `${Year}-${Month}-${Day}`;
//       res = datalists.driverlist.find(
//         (item) => item.value.toUpperCase() == elem.Колдун.toUpperCase()
//       );
//       if (res) {
//         idDr = res._id;
//       } else {
//         idDr = null;
//       }
//       res = datalists.clientList.find(
//         (item) => item.value.toUpperCase() == elem.Заказчик.toUpperCase()
//       );
//       if (res) {
//         idOd = res._id;
//       } else {
//         idOd = null;
//       }
//       res = datalists.citieslist.find(
//         (item) => item.value.toUpperCase() == elem.погрузка.toUpperCase()
//       );
//       if (res) {
//         idLP = JSON.stringify([res._id]);
//       } else {
//         idLP = null;
//       }
//       res = datalists.citieslist.find(
//         (item) => item.value.toUpperCase() == elem.выгрузки.toUpperCase()
//       );
//       if (res) {
//         idUP = JSON.stringify([res._id]); //!!!!!
//       } else {
//         idUP = null;
//       }
//       CuPr = elem.Ставказаказчика;
//       DrPr = elem.Ставкаколдуна;
//       doc = elem.Докты;
//       switch (elem.Платежзаказчика) {
//         case "Ок":
//           CuPay = 1;
//           break;
//         case "нет":
//           CuPay = 2;
//           break;
//         case "мыло":
//           CuPay = 3;
//           break;
//         case "печать":
//           CuPay = 4;
//           break;
//         case "почта":
//           CuPay = 5;
//           break;
//         default:
//           CuPay = 6;
//           break;
//       }
//       switch (elem.Платежколдуну) {
//         case "Ок":
//           DrPay = 1;
//           break;
//         case "нет":
//           DrPay = 2;
//           break;
//         default:
//           DrPay = 0;
//           break;
//       }
//       if (elem.Номеракта != "") {
//         acNum = Number(elem.Номеракта);
//       } else acNum = null;
//       oder = {
//         _id: i,
//         date: dateOd,
//         idDriver: idDr,
//         idCustomer: idOd,
//         idLoadingPoint: idLP,
//         idUnloadingPoint: idUP,
//         customerPrice: CuPr,
//         driverPrice: DrPr,
//         document: doc,
//         customerPayment: CuPay,
//         driverPayment: DrPay,
//         accountNumber: acNum,
//       };
//       try {
//         [data] = await db.query("INSERT INTO oderslist SET ?", oder);
//         console.log(data);
//       } catch (err) {
//         console.log({ error: err });
//       }
//     }
//   })();
// });
app.listen(3000, () => console.log("Example app listening on port 3000!"));
