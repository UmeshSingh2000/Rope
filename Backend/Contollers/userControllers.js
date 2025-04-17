


/**
 * @description User login controller
 * @route POST api/userLogin
 * @access Public
 */
const userLogin = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }
}



module.exports = {
    userLogin
}