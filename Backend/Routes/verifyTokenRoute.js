const express = require('express');
const authenticateToken = require('../Middlewares/JWT');
const router = express.Router();

router.get('/verifyToken', authenticateToken, (req, res) => {
    res.json({ message: "Token is valid" })
})


module.exports = router;