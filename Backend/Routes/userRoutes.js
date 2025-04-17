const express = require('express')
const router = express.Router();
const {
    userLogin,
    userSignup
} = require('../Contollers/userControllers')




/**
 * @description User login route
 * @route POST api/userLogin
 */

router.post('/userLogin', userLogin)
router.post('/userSignup', userSignup)


module.exports = router;