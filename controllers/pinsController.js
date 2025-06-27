// src/controllers/pinsController.js
const pinterestClient = require('../config/pinterestClient');

// GET all pins
exports.getPins = async (req, res) => {
  try {
    const client = pinterestClient();
    const { data } = await client.get('/pins');
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching pins:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
};

// POST new pin
exports.createPin = async (req, res) => {
  try {
    const client = pinterestClient(req.user.accessToken);
    const { board_id, title, description, media } = req.body;

    const payload = {
      board_id,
      title,
      description,
      media_source: { ...media }
    };
    const { data } = await client.post('/pins', payload);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
