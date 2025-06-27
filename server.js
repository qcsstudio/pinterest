// src/app.js
const express = require('express');
const session = require('express-session');
const pinsRoutes = require('./routes/pinsRoutes');
const authRoutes = require('./routes/authRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(
  session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true })
);

app.use('/auth', authRoutes);
app.use('/pins', pinsRoutes);
app.use('/analytics', analyticsRoutes);

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
