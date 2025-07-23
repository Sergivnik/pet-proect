const mysql = require('mysql2');
const options = require('./config.js');

let TasksDada = {
  editData: async function (newData, callback) {
    console.log('editData', newData);
    const db = mysql.createPool(options.sql).promise();
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
    db.end();
  },
  addData: async function (newData, userId, callback) {
    console.log('addData', newData);
    const db = mysql.createPool(options.sql).promise();
    let connection;
    try {
      connection = await db.getConnection();
      await connection.beginTransaction();

      let [user] = await connection.query(`SELECT * FROM users WHERE _id=?`, userId);

      let ownerId = user[0].ownerId;
      if (newData.editTable != 'ownerlogist' && newData.editTable != 'cities') {
        newData.newData.ownerId = ownerId;
      }
      console.log(`INSERT INTO ${newData.editTable} SET ?`, newData.newData);

      let [data] = await connection.query(
        `INSERT INTO ${newData.editTable} SET ?`,
        newData.newData
      );

      if (newData.editTable === 'ownerlogist') {
        let newYearConst = {
          lastyeartaxdebt: 0,
          taxadvance: 0,
          fixedincometax: 0,
          deposit: 0,
          ownerId: data.insertId,
        };
        console.log(`INSERT INTO yearconst SET ?`, newYearConst);
        await connection.query(`INSERT INTO yearconst SET ?`, newYearConst);
      }
      await connection.commit();
      callback(data);
    } catch (err) {
      if (connection) await connection.rollback();
      callback({ error: err });
    } finally {
      if (connection) connection.release();
      db.end();
    }
  },
  delData: async function (id, editTable, callback) {
    console.log(`Attempting to delete id: ${id} from table: ${editTable}`);
    let check = 0;
    const db = mysql.createPool(options.sql).promise();
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
      case 'ownerlogist':
        console.log(`Deleted ownerlogist`, id);

        try {
          let [data] = await db.query(`SELECT * FROM oderslist WHERE ownerId=${id}`);
          check = data.length;

          [data] = await db.query(`SELECT * FROM tracklist WHERE ownerId=${id}`);
          check = check + data.length;

          [data] = await db.query(`SELECT * FROM trackdrivers WHERE ownerId=${id}`);
          check = check + data.length;

          [data] = await db.query(`SELECT * FROM customerclients WHERE ownerId=${id}`);
          check = check + data.length;

          [data] = await db.query(`SELECT * FROM customerorders WHERE ownerId=${id}`);
          check = check + data.length;

          [data] = await db.query(`SELECT * FROM customerpayment WHERE ownerId=${id}`);
          check = check + data.length;

          [data] = await db.query(`SELECT * FROM clientmanager WHERE ownerId=${id}`);
          check = check + data.length;

          [data] = await db.query(`SELECT * FROM drivers WHERE ownerId=${id}`);
          check = check + data.length;

          [data] = await db.query(`SELECT * FROM incomereport WHERE ownerId=${id}`);
          check = check + data.length;

          [data] = await db.query(`SELECT * FROM oders WHERE ownerId=${id}`);
          check = check + data.length;

          [data] = await db.query(`SELECT * FROM storelist WHERE ownerId=${id}`);
          check = check + data.length;

          [data] = await db.query(`SELECT * FROM taskstable WHERE ownerId=${id}`);
          check = check + data.length;

          [data] = await db.query(`SELECT * FROM users WHERE ownerId=${id}`);
          check = check + data.length;

          [data] = await db.query(`SELECT * FROM cardpayment WHERE ownerId=${id}`);
          check = check + data.length;

          console.log(`Total related records found: ${check}`);

          if (check == 0) {
            await db.query(`DELETE FROM ownerlogist WHERE id=${id}`);
            console.log(`Deleted ownerlogist with id: ${id}`);
            callback('success!');
          } else {
            callback({
              error: 'Данного клиента нельзя удалить, так как существуют связанные записи',
              NoErr: 'userErr1',
            });
          }
        } catch (err) {
          console.log('Error in delData for ownerlogist:', err);
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
    db.end();
  },
};
module.exports = TasksDada;
