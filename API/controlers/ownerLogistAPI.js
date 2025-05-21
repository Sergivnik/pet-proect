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
  tasksOwnerLogist.add(req.body, data => callBack(data, res));
};

module.exports.editOwnerLogist = (req, res) => {
  res.set('Access-Control-Allow-Credentials', 'true');
  tasksOwnerLogist.edit(req.body, data => callBack(data, res));
};

module.exports.deleteOwnerLogist = (req, res) => {
  res.set('Access-Control-Allow-Credentials', 'true');
  tasksOwnerLogist.delete(req.params.id, data => callBack(data, res));
};
