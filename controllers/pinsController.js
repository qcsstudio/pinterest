// src/controllers/pinsController.js
const pinterestClient = require('../config/pinterestClient');

// GET all pins
exports.getPins = async (req, res) => {
  try {
    const client = pinterestClient(req.user.accessToken); // Must be user access token

    const { data: pinList } = await client.get('/pins');

    // Dynamic date range (last 30 days)
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 30);
    const start = startDate.toISOString().split('T')[0];
    const end = today.toISOString().split('T')[0];

    const metrics = [
      'TOTAL_AUDIENCE',
      'ENGAGED_AUDIENCE',
      'IMPRESSION',
      'CLICKTHROUGH',
      'ENGAGEMENT',
      'PIN_CLICK',
      'SAVE',
      'SAVE_RATE',
      'OUTBOUND_CLICK_RATE',
      'OUTBOUND_CLICK',
      'VIDEO_V50_WATCH_TIME',
      'QUARTILE_95_PERCENT_VIEW',
      'VIDEO_MRC_VIEW',
      'VIDEO_AVG_WATCH_TIME',
      'VIDEO_START',
      'VIDEO_10S_VIEW',
      'PIN_CLICK_RATE',
      'ENGAGEMENT_RATE'
    ].join(',');

    // Fetch analytics for each pin
    const pinsWithAnalytics = await Promise.all(
      pinList.items.map(async (pin) => {
        try {
          const { data: analytics } = await client.get(`/pins/${pin.id}/analytics`, {
            params: {
              start_date: start,
              end_date: end,
              metric_types: metrics,
            },
          });

          return {
            ...pin,
            analytics,
          };
        } catch (analyticsErr) {
          console.warn(`Analytics failed for pin ${pin.id}:`, analyticsErr.response?.data || analyticsErr.message);
          return {
            ...pin,
            analytics: null,
          };
        }
      })
    );

    res.status(200).json({ items: pinsWithAnalytics });
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
