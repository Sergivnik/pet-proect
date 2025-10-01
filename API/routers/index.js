const express = require('express');
const router = express.Router();

const APIRouter = require('./APIRouter.js');
const ReportRouter = require('./ReportRouter.js');
//const APIMongoDBRouter = require("./APIMongoDBRouter.js");

router.use('/oders', APIRouter);
router.use('/API', APIRouter);
router.use('/API/reports', ReportRouter);
router.use('/customer', APIRouter);
//router.use("/API_MONGODB", APIMongoDBRouter);

module.exports = router;
