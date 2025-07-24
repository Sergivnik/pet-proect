const mysql = require('mysql2');
const options = require('./config.js');
const bcryptjs = require('bcryptjs');

let TasksUser = {
  addNewUser: async (data, userId, callback) => {
    const db = mysql.createPool(options.sql).promise();
    const salt = bcryptjs.genSaltSync(options.saltRounds);
    let password = bcryptjs.hashSync(data.password, salt);

    let user = {
      login: data.login,
      password: password,
      name: data.name,
      role: data.role,
      customerId: data.customerId,
      managerID: data.managerID,
      ownerId: data.ownerId,
    };
    console.log('user.ownerId', user.ownerId);

    try {
      if (user.ownerId == undefined) {
        let [currentUser] = await db.query(`SELECT * FROM users WHERE _id=?`, userId);
        let ownerId = currentUser[0].ownerId;
        user.ownerId = ownerId;
        console.log('INSERT INTO users SET ?', user);
        await db.query('INSERT INTO users SET ?', user);
      } else {
        await db.query('INSERT INTO users SET ?', user);
      }
      callback('success!');
    } catch (err) {
      console.log(err);
      callback({ error: err });
    }
    db.end();
  },
  checkUser: async (data, callback) => {
    const db = mysql.createPool(options.sql).promise();
    try {
      let user = await db.query(`SELECT * FROM users WHERE login="${data.login}"`);
      user = user[0];
      let ownerId = user[0].ownerId;
      let owner = await db.query(`SELECT * FROM ownerlogist WHERE id=${ownerId}`);
      owner = owner[0];
      if (user.length > 0) {
        console.log(data.password, user[0].password);
        let check = bcryptjs.compareSync(data.password, user[0].password);
        if (check) {
          callback(
            {
              name: user[0].name,
              role: user[0].role,
              login: user[0].login,
              customerId: user[0].customerId,
              managerID: user[0].managerID,
              _id: user[0]._id,
              owner: owner,
            },
            user[0]._id
          );
        } else {
          callback({ error: 'password is wrong!' });
        }
      } else {
        callback({ error: "user doesn't exist" }, undefined);
      }
    } catch (err) {
      callback({ error: err });
    }
    db.end();
  },
  changePassword: async (userId, changeData, callback) => {
    const salt = bcryptjs.genSaltSync(options.saltRounds);
    console.log('tasksUser:', userId, changeData);
    const db = mysql.createPool(options.sql).promise();
    try {
      let user = await db.query(`SELECT * FROM users WHERE _id="${userId}"`);
      user = user[0];
      let check = bcryptjs.compareSync(changeData.oldPassword, user[0].password);
      if (check) {
        let password = bcryptjs.hashSync(changeData.newPassword, salt);
        await db.query(`UPDATE users SET password="${password}" WHERE _id="${userId}"`);
        callback('success!!');
      } else {
        callback({ error: 'wrong password!' });
      }
    } catch (err) {
      callback({ error: err });
    }
  },
};
module.exports = TasksUser;
