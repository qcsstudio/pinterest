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

    // Calculate 90-day range
    const today = new Date();
    const maxDaysBack = 89;
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - maxDaysBack);

    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = today.toISOString().split('T')[0];

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

    // 📊 Lifetime (Total) data
    const totalRes = await client.get('/user_account/analytics', {
      params: {
        metrics,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        granularity: 'TOTAL'
      }
    });

    // 📆 Daily data
    const dailyRes = await client.get('/user_account/analytics', {
      params: {
        metrics,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        granularity: 'DAY'
      }
    });

    res.status(200).json({
      summary_metrics: totalRes.data,
      daily_metrics: dailyRes.data?.all_metrics || [] // in case Pinterest responds with .all_metrics
    });

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