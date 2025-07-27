const express = require("express");
const router = express.Router();

const APIRouter = require("./APIRouter.js");
//const APIMongoDBRouter = require("./APIMongoDBRouter.js");

//router.use("/oders", APIRouter);
router.use("/API", APIRouter);
//router.use("/customer", APIRouter);
//router.use("/API_MONGODB", APIMongoDBRouter);

module.exports = router;
