const express = require('express');
const router = express.Router();
const authRoutes = require('./routes/authRoutes');

router.use('/api', authRoutes); // sve auth rute idu pod /api

module.exports = router; // 🚨 exportujemo router, ne app