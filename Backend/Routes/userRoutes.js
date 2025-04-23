const express = require('express')
const router = express.Router();
const {
    userLogin,
    userSignup,
    forgetPassword,
    verifyOTP,
    resetPassword
} = require('../Controllers/userControllers');
const authenticateToken = require('../Middlewares/JWT');
const { sendMessage, getAllMessages } = require('../Controllers/messageController');



/**
 * @description User route
 * @route POST api/---
 */

router.post('/userLogin', userLogin) // route to login user
router.post('/userSignup', userSignup) // route to signup user
router.post('/forgetPassword', forgetPassword); // route to send mail to user for forget password
router.post('/verifyOTP', verifyOTP); // route to verify OTP
router.post('/resetPassword', resetPassword)


// message related routes
router.post('/sendMessage',authenticateToken,sendMessage)
router.post('/getAllMessages',authenticateToken,getAllMessages)

module.exports = router;