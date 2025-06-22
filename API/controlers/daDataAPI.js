const axios = require('axios');
const configApp = require('../models/config.js');

const urlTIN = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party';
const urlRCBIC = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/bank';

const config = {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Token ${configApp.dadataToken}`,
  },
};

module.exports.getDataTin = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const data = { query };
    const response = await axios.post(urlTIN, data, config);

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching TIN data:', error);
    res.status(500).json({ error: 'Failed to fetch TIN data' });
  }
};

module.exports.getDataBank = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const data = { query };
    const response = await axios.post(urlRCBIC, data, config);

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching bank data:', error);
    res.status(500).json({ error: 'Failed to fetch bank data' });
  }
};
