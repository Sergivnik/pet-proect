const mysql = require('mysql2');
const configEmail = require('../models/config.js');
const db = require('./db.js').promisePool;
const nodemailer = require('nodemailer');

let TasksPostTrack = {
  addPostTrack: async (data, callBack) => {
    console.log('Received data:', data);

    try {
      // Обновляем данные в таблице oderslist
      const query = `
        UPDATE oderslist 
        SET postTracker = ?, 
            customerPayment = CASE 
                              WHEN customerPayment NOT IN ('Ок', 'Частично оплачен') THEN ? 
                              ELSE customerPayment 
                              END 
        WHERE _id IN (?);
      `;
      const values = [data.postTrackNumber, 'Почта', data.orderList];

      console.log('Executing query with values:', values);
      await db.query(query, values);

      // Получаем данные заказов
      const [orderList] = await db.query(`SELECT * FROM oderslist WHERE _id IN (?)`, [
        data.orderList,
      ]);

      console.log('Orders retrieved:', orderList);

      // Формируем список номеров счетов
      const accountNumberList = orderList.map(order => order.accountNumber).join(', ');

      let emailAddresses = ['sergivnik@mail.ru'];

      // Получаем email клиента, если есть
      const customerId = orderList[0]?.idCustomer;
      if (customerId) {
        const [customer] = await db.query(`SELECT email FROM oders WHERE _id = ?`, [customerId]);
        if (customer[0]?.email) emailAddresses.push(customer[0].email);
      }

      // Получаем email менеджера, если есть
      const managerId = orderList[0]?.idManager;
      if (managerId) {
        const [manager] = await db.query(`SELECT email FROM clientmanager WHERE _id = ?`, [
          managerId,
        ]);
        if (manager[0]?.email) emailAddresses.push(manager[0].email);
      }

      // Удаляем дубликаты email
      emailAddresses = [...new Set(emailAddresses)];
      console.log('Email addresses to notify:', emailAddresses);

      // Настраиваем отправку письма
      const transporter = nodemailer.createTransport(configEmail.email);

      await transporter.sendMail({
        from: '"ИП Иванов Сергей" <sergivnik@mail.ru>', // sender address
        to: emailAddresses.join(', '), // список получателей
        subject: 'Комплект документов отправленных почтой', // Тема письма
        html: `
          <span>Вам отправлены почтой комплект документов по счетам № ${accountNumberList}</span>
          <br>
          <h3>Номер почтового трека: ${data.postTrackNumber}</h3>
          <b>ИП Иванов С.Н., тел. +7-991-366-13-66</b>
        `,
      });

      console.log('Email sent successfully');
      callBack('success!');
    } catch (err) {
      console.error('Error:', err);
      callBack({ error: err });
    } finally {
    }
  },
};

module.exports = TasksPostTrack;
