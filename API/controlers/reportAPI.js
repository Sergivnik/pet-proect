const taskReports = require('../models/taskReports.js');

module.exports.getReceiptsByDate = (req, res) => {
  const { dateBegin, dateEnd } = req.body;
  taskReports.receiptsByDate(dateBegin, dateEnd, req.session.userId, data => {
    if (data && data.error) {
      res.status(500);
      res.json({ message: data.error });
    } else {
      res.json(data);
    }
  });
};

module.exports.getTripsByDate = (req, res) => {
  const { dateBegin, dateEnd } = req.body;
  taskReports.tripsByDate(dateBegin, dateEnd, req.session.userId, data => {
    if (data && data.error) {
      res.status(500);
      res.json({ message: data.error });
    } else {
      res.json(data);
    }
  });
};
