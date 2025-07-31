const db = require('./db.js').promisePool;

let tasksTasks = {
  getTasksNumber: async (userId, callBack) => {
    console.log(userId);
    try {
      let [data] = await db.query(
        `SELECT * FROM taskstable where statusOfTask = "Новое" and userId = ?`,
        [userId]
      );
      callBack(data.length);
    } catch (err) {
      console.log(err);
      callBack({ error: err, message: 'failure' });
    }
  },
  getTasksData: async (userId, callBack) => {
    console.log(`Getting tasks data of user ${userId}`);
    let setData = {};
    try {
      let [data] = await db.query(`SELECT * FROM taskstable where userId = ? or senderId = ?`, [
        userId,
        userId,
      ]);
      setData.taskstable = data;
      [data] = await db.query(`SELECT customerId FROM users where _id = ?`, [userId]);
      let customerId = data[0].customerId;
      console.log(customerId);
      if (customerId != null) {
        [data] = await db.query(
          `SELECT _id, name, customerId FROM users where customerId = ? or customerId is null`,
          [customerId]
        );
      } else {
        [data] = await db.query(`SELECT _id, name, customerId FROM users`);
      }
      setData.users = data;
      callBack(setData);
    } catch (err) {
      console.log(err);
      callBack({ error: err, message: 'failure' });
    }
  },
  addNewTask: async (task, callBack) => {
    console.log(`adding task data:`, task);
    try {
      let [data] = await db.query(`INSERT INTO taskstable set ?`, [task]);
      callBack(data);
    } catch (err) {
      callBack({ error: err });
    }
  },
  editTask: async (data, callBack) => {
    console.log(`edit task data:`, data);
    try {
      await db.query(`UPDATE taskstable SET ${data.editField} = ? WHERE _id = ?`, [
        data.newValue,
        data.id,
      ]);
      callBack('Success!');
    } catch (err) {
      callBack({ error: err });
    }
  },
  delTask: async (id, callBack) => {
    console.log(`delete `, id);
    try {
      await db.query(`DELETE FROM taskstable WHERE _id = ?`, [id]);
      callBack('Success!');
    } catch (err) {
      console.log(err);
      callBack({ error: err });
    }
  },
};
module.exports = tasksTasks;
