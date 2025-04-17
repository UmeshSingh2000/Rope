const express = require('express')
const router = express.Router();
const {
    userLogin,
    userSignup,
    forgetPassword
} = require('../Contollers/userControllers');
// const authenticateToken = require('../Middlewares/JWT');


/**
 * @description User route
 * @route POST api/userLogin
 */

router.post('/userLogin', userLogin) // route to login user
router.post('/userSignup', userSignup) // route to signup user
router.post('/forgetPassword', forgetPassword); // route to send mail to user for forget password

module.exports = router;