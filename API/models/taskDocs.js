const db = require('./db.js').promisePool;
const puppeteer = require('puppeteer');
const fs = require('fs');
const util = require('util'); // Добавьте эту строку для подключения модуля util
const path = require('path');
const writeFileAsync = util.promisify(fs.writeFile);
const unlinkAsync = util.promisify(fs.unlink);

var TaskDocs = {
  add: async function (listId, docNumber, callback) {
    if (!isNaN(docNumber)) {
      if (docNumber < 10 && docNumber > 0) docNumber = '000' + docNumber;
      if (docNumber < 100 && docNumber > 9) docNumber = '00' + docNumber;
      if (docNumber < 1000 && docNumber > 99) docNumber = '0' + docNumber;
      if (docNumber < 10000 && docNumber > 999) docNumber = '' + docNumber;
    }
    try {
      for (const id of listId) {
        await db.query(`UPDATE oderslist SET accountNumber="${docNumber}" WHERE _id=${id}`);
      }
      callback('success');
    } catch (err) {
      callback({ error: err });
    }
  },
  createContract: async (customer, html, css, callBack) => {
    try {
      const cssFilePath = path.join(__dirname, 'temp.css');
      await writeFileAsync(cssFilePath, css, 'utf8');

      const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
      const page = await browser.newPage();
      await page.setContent(html);
      await page.addStyleTag({ path: cssFilePath });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        margin: {
          top: '5mm',
          bottom: '5mm',
          left: '10mm',
          right: '0mm',
        },
        printBackground: true,
      });

      await browser.close();

      const exists = fs.existsSync(`./API/contracts/${customer.value}`);
      if (!exists) {
        fs.mkdirSync(`./API/contracts/${customer.value}`, { recursive: true });
      }

      const pdfFilePath = `./API/contracts/${customer.value}/contract.pdf`;
      await writeFileAsync(pdfFilePath, pdfBuffer);
      await unlinkAsync(cssFilePath);

      callBack('success!');
    } catch (err) {
      callBack({ error: err });
    }
  },
  createDriverContract: async (driver, html, css, callBack) => {
    try {
      const cssFilePath = path.join(__dirname, 'temp.css');
      await writeFileAsync(cssFilePath, css, 'utf8');

      const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
      const page = await browser.newPage();
      await page.setContent(html);
      await page.addStyleTag({ path: cssFilePath });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        margin: {
          top: '5mm',
          bottom: '5mm',
          left: '10mm',
          right: '0mm',
        },
        printBackground: true,
      });

      await browser.close();

      const exists = fs.existsSync(`./API/docs/${driver.value}`);
      if (!exists) {
        fs.mkdirSync(`./API/docs/${driver.value}`, { recursive: true });
      }

      const pdfFilePath = `./API/docs/${driver.value}/docOwner.pdf`;
      await writeFileAsync(pdfFilePath, pdfBuffer);
      await unlinkAsync(cssFilePath);

      callBack('success!');
    } catch (err) {
      callBack({ error: err });
    }
  },
  getDataFromTableByIdAsyhc: async (id, table) => {
    let dataFromTable = {};
    let data;
    try {
      if (table == 'contractorspayments') {
        [data] = await db.query(`SELECT * FROM ${table} WHERE id=${id}`);
      } else {
        [data] = await db.query(`SELECT * FROM ${table} WHERE _id=${id}`);
      }
      dataFromTable = data[0];
      return dataFromTable;
    } catch (err) {
      return { error: err };
    } finally {
    }
  },
};

module.exports = TaskDocs;
