let tasks = require("../models/tasksDriver.js");

const callBack = (data, req, res, dataIo, socketName) => {
  if (data.error) {
    console.log(data);
    res.status(500);
    res.json({ message: data.error });
  } else {
    if (dataIo) req.app.get("io").emit(socketName, dataIo);
    res.json(data);
  }
};

module.exports.getDriverPayments = (req, res) => {
  res.set("Access-Control-Allow-Credentials", "true");
  console.log(req.sessionID, req.session.userId);
  tasks.getDriverPayments((data) => callBack(data, req, res, null, null));
};
module.exports.delDriverPayment = (req, res) => {
  res.set("Access-Control-Allow-Credentials", "true");
  console.log(req.params.id, req.session.userId, "delDriverPayment");
  let dataIo = req.params.id;
  tasks.delDriverPayment(req.params.id, (data) =>
    callBack(data, req, res, dataIo, "deletedDriverPayment")
  );
};
