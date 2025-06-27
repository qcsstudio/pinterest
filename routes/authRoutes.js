// src/routes/authRoutes.js
const router = require('express').Router();
const { authCallback, authLogin } = require('../controllers/authController');

router.get('/callback', authCallback);
router.get('/login', authLogin);    // NEW

module.exports = router;
