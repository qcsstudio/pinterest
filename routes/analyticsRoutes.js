// src/routes/analyticsRoutes.js
const router = require('express').Router();
const { getUserAnalytics  , getAnalyticsByDateRange, getLifetimeAnalytics } = require('../controllers/analyticsController');
const { authMiddleware } = require('../middlewares/auth');

router.get('/', authMiddleware, getUserAnalytics);
router.get('/range', authMiddleware, getAnalyticsByDateRange);
router.get('/lifetime', authMiddleware, getLifetimeAnalytics);

module.exports = router;
