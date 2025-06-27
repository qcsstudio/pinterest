// src/config/pinterestClient.js
const axios = require('axios');

const pinterestClient = () => {
  const accessToken = process.env.PINTEREST_TEST_TOKEN; // or whatever env var you use
  if (!accessToken) {
    throw new Error('PINTEREST_TEST_TOKEN is not defined in env variables.');
  }

  return axios.create({
    baseURL: 'https://api.pinterest.com/v5',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

module.exports = pinterestClient;
