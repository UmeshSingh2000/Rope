const {
  checkEmail,
  generateToken
} = require('../Utils/helperFunction.js')
const bcrypt = require('bcrypt');
const User = require('../models/userSchema')


/**
 * @description User login controller
 * @route POST api/userLogin
 * @access Public
 */
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
    if (!checkEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }
    const isUserExists = await User.findOne({ email });
    if (!isUserExists) {
      return res.status(400).json({ message: "User does not exists with this Email" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, isUserExists.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Incorrect Password" });
    }
    const token = generateToken({
      id: isUserExists._id,
      name: isUserExists.name,
    });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path : '/',
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    })
    return res.status(200).json({ message: "Login Success" });
  }
  catch (err) {
    return res.status(500).json({ message: "Internal server error", err });
  }
}


const userSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is Required" });
    }
    if (!email) {
      return res.status(400).json({ message: "Email is Required" });
    }
    if (!checkEmail(email)) {
      return res
        .status(400)
        .json({ message: "Please enter a valid email address" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password is Required" });
    }
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};


module.exports = {
  userLogin,
  userSignup
};
