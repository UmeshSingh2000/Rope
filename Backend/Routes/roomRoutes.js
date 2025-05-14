const express = require('express');
const authenticateToken = require('../Middlewares/JWT');
const { createRoom } = require('../Controllers/roomController');
const router = express.Router();


router.post('/createRoom', authenticateToken, createRoom)

module.exports = router;