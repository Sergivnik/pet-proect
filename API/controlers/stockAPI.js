let tasks = require('../models/taskStock.js');

const callBack = (data, res) => {
  if (data.error) {
    console.log(data);
    res.status(500);
    res.json({ message: data.error });
  } else {
    res.json(data);
  }
};

module.exports.getStockTransactions = (req, res) => {
  res.set('Access-Control-Allow-Credentials', 'true');
  console.log('getStockTransactions', req.sessionID, req.session.userId);
  tasks.getStockData(req.session.userId, data => callBack(data, res));
};
