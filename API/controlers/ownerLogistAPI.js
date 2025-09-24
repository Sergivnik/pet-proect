const tasksOwnerLogist = require('../models/taskOwnerLogist.js');

const callBack = (data, res) => {
  if (data.error) {
    console.log(data);
    res.status(500);
    res.json({ message: data.error });
  } else {
    res.json(data);
  }
};

module.exports.getOwnerLogist = (req, res) => {
  console.log('getOwnerLogist');
  res.set('Access-Control-Allow-Credentials', 'true');
  tasksOwnerLogist.list(data => callBack(data, res));
};

module.exports.addOwnerLogist = (req, res) => {
  res.set('Access-Control-Allow-Credentials', 'true');
  console.log('addOwnerLogist', req.body.body.newData);
  tasksOwnerLogist.add(req.body.body.newData, data => {
    if (data.error) {
      return callBack(data, res);
    }
    // Отправляем сокет-событие, как в tasksData.addData
    try {
      req.app.get('io').emit('addedData', {
        dataServer: data,
        newData: req.body.body.newData,
        editTable: 'ownerlogist',
      });
    } catch (e) {
      console.log('socket emit error', e);
    }
    return res.json(data);
  });
};

module.exports.editOwnerLogist = (req, res) => {
  res.set('Access-Control-Allow-Credentials', 'true');
  tasksOwnerLogist.edit(req.body, data => callBack(data, res));
};

module.exports.deleteOwnerLogist = (req, res) => {
  res.set('Access-Control-Allow-Credentials', 'true');
  tasksOwnerLogist.delete(req.params.id, data => {
    if (data.error) {
      return callBack(data, res);
    }
    try {
      req.app.get('io').emit('delData', {
        id: req.params.id,
        editTable: 'ownerlogist',
      });
    } catch (e) {
      console.log('socket emit error', e);
    }
    return res.json(data);
  });
};
