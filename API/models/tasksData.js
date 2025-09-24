// const TasksUser = require('./taskUser.js');
const db = require('./db.js').promisePool;

let TasksDada = {
  editData: async function (newData, callback) {
    console.log('editData', newData);
    if ('_id' in newData.newData) console.log('_id');
    if ('id' in newData.newData) console.log('id');
    try {
      if ('_id' in newData.newData)
        await db.query(`UPDATE ${newData.editTable} SET ? WHERE _id=?`, [
          newData.newData,
          newData.newData._id,
        ]);
      if ('id' in newData.newData)
        await db.query(`UPDATE ${newData.editTable} SET ? WHERE id=?`, [
          newData.newData,
          newData.newData.id,
        ]);
      callback('success!');
    } catch (err) {
      console.log(err);
      callback({ error: err });
    }
  },
  addData: async function (newData, userId, callback) {
    console.log('addData', newData);
    let connection;
    try {
      connection = await db.getConnection();
      await connection.beginTransaction();

      let [user] = await connection.query(`SELECT * FROM users WHERE _id=?`, userId);

      let ownerId = user[0].ownerId;
      if (newData.editTable != 'cities') {
        newData.newData.ownerId = ownerId;
      }
      console.log(`INSERT INTO ${newData.editTable} SET ?`, newData.newData);

      let [data] = await connection.query(
        `INSERT INTO ${newData.editTable} SET ?`,
        newData.newData
      );

      await connection.commit();
      callback(data);
    } catch (err) {
      if (connection) await connection.rollback();
      console.log({ error: err });
      callback({ error: err });
    } finally {
      if (connection) connection.release();
    }
  },
  delData: async function (id, editTable, callback) {
    console.log(`Attempting to delete id: ${id} from table: ${editTable}`);
    let check = 0;
    switch (editTable) {
      case 'drivers':
        try {
          let [data] = await db.query(`SELECT * FROM driverdebts where idDriver=${id};`);
          check = data.length;
          [data] = await db.query(`SELECT * FROM driverpayment where idDriver=${id};`);
          check = check + data.length;
          [data] = await db.query(`SELECT * FROM oderslist where idDriver=${id};`);
          check = check + data.length;
          [data] = await db.query(`SELECT * FROM trackdrivers where idOwner=${id};`);
          check = check + data.length;
          [data] = await db.query(`SELECT * FROM tracklist where idOwner=${id};`);
          check = check + data.length;
          console.log(check);
          if (check == 0) {
            await db.query(`DELETE FROM drivers WHERE _id=${id}`);
            callback('success!');
          } else {
            callback({
              error: 'Данного перевозчика нельхя удалить',
              NoErr: 'userErr1',
            });
          }
        } catch (err) {
          console.log(err);
          callback({ error: err });
        }
        break;
      case 'trackdrivers':
        try {
          let [data] = await db.query(`SELECT * FROM oderslist where idTrackDriver=${id};`);
          check = data.length;
          if (check == 0) {
            await db.query(`DELETE FROM trackdrivers WHERE _id=${id}`);
            callback('success!');
          } else {
            callback({
              error: 'Данного перевозчика нельхя удалить',
              NoErr: 'userErr1',
            });
          }
        } catch (err) {
          console.log(err);
          callback({ error: err });
        }
        break;
      case 'tracklist':
        try {
          let [data] = await db.query(`SELECT * FROM oderslist where idTrack=${id};`);
          check = data.length;
          [data] = await db.query(`SELECT * FROM trackdrivers where idTrack=${id};`);
          check = check + data.length;
          if (check == 0) {
            await db.query(`DELETE FROM tracklist WHERE _id=${id}`);
            callback('success!');
          } else {
            callback({
              error: 'Данного перевозчика нельхя удалить',
              NoErr: 'userErr1',
            });
          }
        } catch (err) {
          console.log(err);
          callback({ error: err });
        }
        break;
      case 'cities':
        try {
          let [data] = await db.query(
            `SELECT * FROM oderslist where JSON_CONTAINS(idLoadingPoint, '${id}');`
          );
          check = data.length;
          [data] = await db.query(
            `SELECT * FROM oderslist where JSON_CONTAINS(idUnloadingPoint, '${id}');`
          );
          check = check + data.length;
          if (check == 0) {
            await db.query(`DELETE FROM cities WHERE _id=${id}`);
            callback('success!');
          } else {
            callback({
              error: 'Данного перевозчика нельхя удалить',
              NoErr: 'userErr1',
            });
          }
        } catch (err) {
          console.log(err);
          callback({ error: err });
        }
        break;
      case 'oders':
        try {
          let [data] = await db.query(`SELECT * FROM oderslist where idCustomer=${id}`);
          check = data.length;
          [data] = await db.query(`SELECT * FROM clientmanager where odersId=${id}`);
          check = check + data.length;
          if (check == 0) {
            await db.query(`DELETE FROM oders WHERE _id=${id}`);
            callback('success!');
          } else {
            callback({
              error: 'Данного перевозчика нельхя удалить',
              NoErr: 'userErr1',
            });
          }
        } catch (err) {
          console.log(err);
          callback({ error: err });
        }
        break;
      case 'clientmanager':
        try {
          let [data] = await db.query(`SELECT * FROM oderslist where idManager=${id}`);
          check = data.length;
          if (check == 0) {
            await db.query(`DELETE FROM clientmanager WHERE _id=${id}`);
            callback('success!');
          } else {
            callback({
              error: 'Данного перевозчика нельхя удалить',
              NoErr: 'userErr1',
            });
          }
        } catch (err) {
          console.log(err);
          callback({ error: err });
        }
        break;
      case 'storelist':
        try {
          let [data] = await db.query(
            `SELECT * FROM customerorders where JSON_CONTAINS(loadingStoreId, '${id}');`
          );
          check = data.length;
          [data] = await db.query(
            `SELECT * FROM customerorders where JSON_CONTAINS(unloadingStoreId, '${id}');`
          );
          check = check + data.length;
          if (check == 0) {
            await db.query(`DELETE FROM storelist WHERE _id=${id}`);
            callback('success!');
          } else {
            callback({
              error: 'Данный склад нельхя удалить',
              NoErr: 'userErr1',
            });
          }
        } catch (err) {
          console.log(err);
          callback({ error: err });
        }
        break;
      case 'contractors':
        try {
          let [data] = await db.query(`SELECT * FROM contractorspayments WHERE idContractor=${id}`);
          check = data.length;
          if (check == 0) {
            await db.query(`DELETE FROM contractors WHERE _id=${id}`);
            callback('success!');
          } else {
            callback({
              error: 'Данного контрагента нельхя удалить',
              NoErr: 'userErr1',
            });
          }
        } catch (err) {
          console.log(err);
          callback({ error: err });
        }
    }
  },
};
module.exports = TasksDada;
