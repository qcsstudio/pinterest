// src/routes/pinsRoutes.js
const router = require('express').Router();
const { getPins, createPin } = require('../controllers/pinsController');
const { authMiddleware } = require('../middlewares/auth');

router.get('/', authMiddleware, getPins);
router.post('/', authMiddleware, createPin);

module.exports = router;
