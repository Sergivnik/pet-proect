const db = require('./db.js').promisePool;
const options = require('./config.js');
const bcryptjs = require('bcryptjs');

let TasksUser = {
  addNewUser: async (data, userId, callback) => {
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
        let [currentUser] = await db.query(`SELECT * FROM users WHERE _id = ?`, [userId]);
        let ownerId = currentUser[0].ownerId;
        user.ownerId = ownerId;
        console.log('INSERT INTO users SET ?', user);
        await db.query('INSERT INTO users SET ?', [user]);
      } else {
        await db.query('INSERT INTO users SET ?', [user]);
      }
      callback('success!');
    } catch (err) {
      console.log(err);
      callback({ error: err });
    }
  },
  checkUser: async (data, callback) => {
    try {
      let [user] = await db.query(`SELECT * FROM users WHERE login = ?`, [data.login]);
      user = user[0];
      if (user) {
        let ownerId = user.ownerId;
        let [owner] = await db.query(`SELECT * FROM ownerlogist WHERE id = ?`, [ownerId]);
        owner = owner[0];
        console.log(data.password, user.password);
        let check = bcryptjs.compareSync(data.password, user.password);
        if (check) {
          callback(
            {
              name: user.name,
              role: user.role,
              login: user.login,
              customerId: user.customerId,
              managerID: user.managerID,
              _id: user._id,
              owner: owner,
            },
            user._id
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
  },
  changePassword: async (userId, changeData, callback) => {
    const salt = bcryptjs.genSaltSync(options.saltRounds);
    console.log('tasksUser:', userId, changeData);
    try {
      let [user] = await db.query(`SELECT * FROM users WHERE _id = ?`, [userId]);
      console.log(user);
      
      user = user[0];
      let check = bcryptjs.compareSync(changeData.oldPassword, user.password);
      console.log(check);

      if (check) {
        let password = bcryptjs.hashSync(changeData.newPassword, salt);
        await db.query(`UPDATE users SET password = ? WHERE _id = ?`, [password, userId]);
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
