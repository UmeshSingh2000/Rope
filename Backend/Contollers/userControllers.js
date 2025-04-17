const checkEmail = require("../Utils/helperFunction.js");
const bcrypt = require('bcrypt');


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
};

const userSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is Required" });
    }
    if (!email) {
      return res.status(400).json({ message: "Email is Required" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password is Required" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!checkEmail(email)) {
      return res
        .status(400)
        .json({ message: "Please enter a valid email address" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({message: "User created successfully"})
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  userLogin,
  userSignup
};
