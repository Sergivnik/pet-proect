const db = require('./db.js').promisePool;
const dateToSqlString = dateSomeFormate => {
  let date = new Date(dateSomeFormate);
  let Year = date.getFullYear();
  let Month = date.getMonth() + 1;
  let Day = date.getDate();
  return `${Year}-${Month}-${Day}`;
};

let TasksAddData = {
  editData: async (newData, callBack) => {
    if (newData.date != null) newData.date = dateToSqlString(newData.date);
    console.log(newData);
    try {
      await db.query(`UPDATE addtable SET ? WHERE id=?`, [newData, newData.id]);
      callBack('Success!');
    } catch (err) {
      console.log(err);
      callBack({ error: err });
    }
  },
  delete: async (id, callBack) => {
    console.log(id);
    try {
      await db.query(`DELETE FROM addtable WHERE id=${id}`);
      callBack('success!');
    } catch (err) {
      console.log(err);
      callBack({ error: err });
    }
  },
};
module.exports = TasksAddData;
