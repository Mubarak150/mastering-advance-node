const express = require('express');
const router = express.Router(); 
const {protect} = require("../middleware/auth")
const {signup, login, updatePassword} = require('../controllers/authController')

router.route('/signup').post(signup)
router.route('/login').post(login)
router.route('/update/password').post(protect, updatePassword)

module.exports = router; 