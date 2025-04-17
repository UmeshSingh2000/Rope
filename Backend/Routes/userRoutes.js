const express = require('express')
const router = express.Router();
const {
    userLogin
} = require('../Contollers/userControllers')




/**
 * @description User login route
 * @route POST api/userLogin
 */

router.post('/userLogin', userLogin)


module.exports = router;