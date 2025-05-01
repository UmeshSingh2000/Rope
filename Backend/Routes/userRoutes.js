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
    userLogout,
} = require('../Controllers/userControllers');
const authenticateToken = require('../Middlewares/JWT');
const { sendMessage, getAllMessages } = require('../Controllers/messageController');

/**
 * @description Get the authenticated user's ID
 * @route GET api/getMyId
 * @access Private
 */
router.get('/getMyId', authenticateToken, getUserId)

/**
 * @description User login controller
 * @route POST api/userLogin
 * @access Public
 */
router.post('/userLogin', userLogin)

/**
 * @description User registration (signup) controller
 * @route POST api/userSignup
 * @access Public
 */
router.post('/userSignup', userSignup)

/**
 * @description Request a password reset email
 * @route POST api/forgetPassword
 * @access Public
 */
router.post('/forgetPassword', forgetPassword)

/**
 * @description Verify OTP for password reset
 * @route POST api/verifyOTP
 * @access Public
 */
router.post('/verifyOTP', verifyOTP)

/**
 * @description Reset user password after OTP verification
 * @route POST api/resetPassword
 * @access Public
 */
router.post('/resetPassword', resetPassword)

/**
 * @description Add a friend to the authenticated user's friend list
 * @route POST api/addFriend
 * @access Private
 */
router.post('/addFriend', authenticateToken, addFriend)

/**
 * @description Get the list of friends for the authenticated user
 * @route GET api/getMyFriends
 * @access Private
 */
router.get('/getMyFriends', authenticateToken, getMyFriends)

/**
 * @description User logout controller
 * @route GET api/logout
 * @access Private
 */
router.get('/logout', authenticateToken, userLogout)

/**
 * @description Get all messages between the authenticated user and another user
 * @route POST api/getAllMessages
 * @access Private
 */
router.post('/getAllMessages', authenticateToken, getAllMessages)

/**
 * @description Get user details by username
 * @route GET api/getUserByUserName
 * @access Private
 */
router.get('/getUserByUserName', authenticateToken, getUserByUserName)

module.exports = router;