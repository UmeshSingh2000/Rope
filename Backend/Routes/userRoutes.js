const express = require('express')
const router = express.Router();
const {
    userLogin,
    userSignup,
    forgetPassword,
    verifyOTP
} = require('../Controllers/userControllers');
const authenticateToken = require('../Middlewares/JWT');
// const authenticateToken = require('../Middlewares/JWT');


/**
 * @description User route
 * @route POST api/---
 */

router.post('/userLogin', userLogin) // route to login user
router.post('/userSignup', userSignup) // route to signup user
router.post('/forgetPassword', forgetPassword); // route to send mail to user for forget password
router.post('/verifyOTP',authenticateToken,verifyOTP); // route to verify OTP

module.exports = router;