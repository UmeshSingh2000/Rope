const express = require('express')
const router = express.Router();
const {
    userLogin,
    userSignup,
    forgetPassword,
    verifyOTP,
    resetPassword,
    getUserId,
    getUserByUserName,
    addFriend,
    getMyFriends,
    getUser,
} = require('../Controllers/userControllers');
const authenticateToken = require('../Middlewares/JWT');
const { sendMessage, getAllMessages } = require('../Controllers/messageController');



/**
 * @description User route
 * @route POST api/---
 */
router.get('/getMyId',authenticateToken,getUserId)
router.post('/userLogin', userLogin) // route to login user
router.post('/userSignup', userSignup) // route to signup user
router.post('/forgetPassword', forgetPassword); // route to send mail to user for forget password
router.post('/verifyOTP', verifyOTP); // route to verify OTP
router.post('/resetPassword', resetPassword)
router.post('/addFriend',authenticateToken, addFriend)
router.get('/getMyFriends',authenticateToken,getMyFriends)






// message related routes
router.post('/getAllMessages',authenticateToken,getAllMessages)
router.post('/getUserByUserName',authenticateToken,getUserByUserName)

module.exports = router;