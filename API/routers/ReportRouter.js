const express = require('express');
const router = express.Router();

const reportAPI = require('../controlers/reportAPI.js');

// /API/reports/* base is mounted from index.js
router.post('/receiptsByDate', reportAPI.getReceiptsByDate);
router.post('/tripsByDate', reportAPI.getTripsByDate);

module.exports = router;
