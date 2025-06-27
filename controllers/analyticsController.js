// src/controllers/analyticsController.js
const pinterestClient = require('../config/pinterestClient');

exports.getUserAnalytics = async (req, res) => {
  try {
    const client = pinterestClient(req.user.accessToken);
    const { data } = await client.get('/user_account/analytics', {
      params: {
        metrics: 'IMPRESSION,CLICK,ENGAGEMENT',
        start_date: '2025-06-01',
        end_date: '2025-06-23'
      }
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch all-time summary only
exports.getLifetimeAnalytics = async (req, res) => {
  try {
    const client = pinterestClient(req.user.accessToken);

    // Calculate dates - Max 90 days back from today
    const today = new Date();
    const maxDaysBack = 89; // 90 days total including today
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - maxDaysBack);

    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = today.toISOString().split('T')[0];

    const { data } = await client.get('/user_account/analytics', {
      params: {
        metrics: 'TOTAL_AUDIENCE,ENGAGED_AUDIENCE,IMPRESS   ION,CLICKTHROUGH,ENGAGEMENT',
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        granularity: 'TOTAL'
      }
    });

    res.status(200).json(data);
  } catch (error) {
    if (error.response) {
      console.error('Pinterest API Error:', {
        status: error.response.status,
        data: error.response.data
      });
      return res.status(error.response.status).json({
        error: 'Pinterest API Error',
        details: error.response.data
      });
    }
    res.status(500).json({ error: error.message });
  }
};

// Fetch between specific dates
exports.getAnalyticsByDateRange = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    if (!start_date || !end_date) {
      return res.status(400).json({ error: 'Please provide both start_date and end_date' });
    }

    const client = pinterestClient(req.user.accessToken);
    const { data } = await client.get('/user_account/analytics', {
      params: {
        metrics: 'IMPRESSION,CLICK,ENGAGEMENT',
        start_date,
        end_date
      }
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};