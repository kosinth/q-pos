const express = require('express')
const router = express.Router();
const {register} = require('../config/auth')

router.post('/register',register)

module.exports = router;