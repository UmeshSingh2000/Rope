const express = require('express')
const router = express.Router();


/**
 * @description User login route
 * @route POST api/userLogin
 */

router.post('/userLogin',(req,res)=>{
    res.send('User Route')
})


module.exports = router;