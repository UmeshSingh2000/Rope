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
 * @swagger
 * /api/getMyId:
 *   get:
 *     summary: Get the authenticated user's ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Return Mongo Id of the authenticated user
 */
router.get('/getMyId', authenticateToken, getUserId)

/**
 * @swagger
 * /api/userLogin:
 *   post:
 *     summary: Log in a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login User to the System
 */
router.post('/userLogin', userLogin)

/**
 * @swagger
 * /api/userSignup:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 */
router.post('/userSignup', userSignup)

/**
 * @swagger
 * /api/forgetPassword:
 *   post:
 *     summary: Request password reset via email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset email sent
 */
router.post('/forgetPassword', forgetPassword)

/**
 * @swagger
 * /api/verifyOTP:
 *   post:
 *     summary: Verify OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified successfully
 */
router.post('/verifyOTP', verifyOTP)

/**
 * @swagger
 * /api/resetPassword:
 *   post:
 *     summary: Reset user password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 */
router.post('/resetPassword', resetPassword)

/**
 * @swagger
 * /api/addFriend:
 *   post:
 *     summary: Add a friend
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               friendId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Friend added successfully
 */
router.post('/addFriend', authenticateToken, addFriend)

/**
 * @swagger
 * /api/getMyFriends:
 *   get:
 *     summary: Get list of my friends
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Friends list retrieved successfully
 */
router.get('/getMyFriends', authenticateToken, getMyFriends)

/**
 * @swagger
 * /api/logout:
 *   get:
 *     summary: Log out the user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
router.get('/logout', authenticateToken, userLogout)

/**
 * @swagger
 * /api/getAllMessages:
 *   post:
 *     summary: Get all messages between two users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               to:
 *                 type: string
 *     responses:
 *       200:
 *         description: Messages retrieved successfully
 */
router.post('/getAllMessages', authenticateToken, getAllMessages)

/**
 * @swagger
 * /api/getUserByUserName:
 *   get:
 *     summary: Get user details by username
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User data retrieved successfully
 */
router.get('/getUserByUserName', authenticateToken, getUserByUserName)

module.exports = router;
