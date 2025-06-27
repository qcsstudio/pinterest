// src/controllers/authController.js
const axios = require('axios');

exports.authCallback = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ error: 'Missing authorization code' });
    }

    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', process.env.PINTEREST_REDIRECT_URI);
    params.append('client_id', process.env.PINTEREST_CLIENT_ID);
    params.append('client_secret', process.env.PINTEREST_CLIENT_SECRET);

    const { data } = await axios.post(
      'https://api.pinterest.com/v5/oauth/token',
      params,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    // Save token to session or DB
    req.session.accessToken = data.access_token;

    return res.redirect('http://localhost:3001/welcome');
  } catch (error) {
    console.error('Error in authCallback:', error.message);

    // Axios error with response? Show that data
    if (error.response) {
      return res.status(error.response.status).json({
        error: error.response.data || error.response.statusText,
        status: error.response.status,
      });
    }

    // Axios no response (e.g. network issue)
    if (error.request) {
      return res.status(502).json({ error: 'No response from Pinterest API' });
    }

    // Other generic errors
    return res.status(500).json({ error: error.message || 'Unknown error' });
  }
};

exports.authLogin = (req, res) => {
  const clientId = process.env.PINTEREST_CLIENT_ID;
  const redirectUri = process.env.PINTEREST_REDIRECT_URI;
  const scopes = ['pins:write', 'boards:read', 'user_accounts:read'];

  const authUrl = `https://www.pinterest.com/oauth/?response_type=code&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&client_id=${clientId}&scope=${scopes.join(' ')}`;

  res.redirect(authUrl);
};