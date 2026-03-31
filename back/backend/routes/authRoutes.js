const express = require('express');
const router = express.Router();
const { customerLogin, adminLogin, customerRegister, adminRegister } = require('../controllers/authController');

router.post('/customer-login', customerLogin);
router.post('/admin-login', adminLogin);
router.post('/customer-register', customerRegister); 
router.post('/admin-register', adminRegister);       

module.exports = router;