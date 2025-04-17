const checkEmail = require("../Utils/helperFunction.js");
const bcrypt = require('bcrypt');

const User = require('../models/userSchema')
const bcrypt = require('bcrypt');

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
        const isUserExists = await User.findOne({ email });
        if (!isUserExists) {
            return res.status(400).json({ message: "User does not exists with this Email" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, isUserExists.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Incorrect Password" });
        }

        return res.status(200).json({ message: "Login Success" });
    }
    catch (err) {
        return res.status(500).json({ message: "Internal server error",err });
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
