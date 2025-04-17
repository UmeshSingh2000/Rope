const express = require('express')
const router = express.Router();
const {
    userLogin,
    userSignup
} = require('../Contollers/userControllers');
const authenticateToken = require('../Middlewares/JWT');


/**
 * @description User route
 * @route POST api/userLogin
 */

router.post('/userLogin', userLogin) // route to login user
router.post('/userSignup', userSignup) // route to signup user
router.get('/home',authenticateToken, (req, res) => {
    res.json({ message: "Home" });
})

module.exports = router;