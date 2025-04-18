const {
  checkEmail,
  generateToken,
  sendMail
} = require('../Utils/helperFunction.js')
const bcrypt = require('bcrypt');
const User = require('../models/userSchema.js')
const fs = require('fs')
const path = require('path')
const { generateOTP } = require('../Utils/helperFunction.js');
const { log } = require('console');

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
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    })
    return res.status(200).json({ message: "Login Success" });
  }
  catch (err) {
    return res.status(500).json({ message: "Internal server error", err });
  }
}

/**
 * @description User Signup controller
 * @route POST api/userSignup
 * @access Public
 */
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


/**
 * @description User forgetPassword controller
 * @route POST api/forgetPassword
 * @access Private
 */
const forgetPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  if (!checkEmail(email)) {
    return res.status(400).json({ message: "Please enter a valid email address" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exists with this Email" });
    }
    const otp = generateOTP();
    const expiresIn = new Date(Date.now() + 5 * 60 * 1000);

    await User.findByIdAndUpdate(user._id, {
      OTP: otp,
      OTPExpiresIn: expiresIn
    });

    const template = fs.readFileSync(path.join(__dirname, '../Template/OTPTemplate.html'), 'utf-8')
    const html = template.replace("{{OTP}}", otp);

    await sendMail({
      to: email,
      subject: "Forget Password",
      html
    })

    return res.status(200).json({ message: "Email sent successfully" });
  }
  catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}


/**
 * @description Verify OTP
 * @route POST api/forgetPassword/verifyOTP
 * @access Public
 */

const verifyOTP = async (req, res) => {
  try {

    const { OTP } = req.body;
    if (!OTP) {
      return res.status(400).json({ message: "OTP is required" })
    }
    const { id } = req.user;
    if (!id) {
      return res.status(400).json({ message: "User id is required" })
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ message: "User does not exists" })
    }

    if (user.OTP !== OTP) {
      return res.status(400).json({ message: "Invalid OTP" })
    }
    const currentTime = new Date();
    if (currentTime > user.OTPExpiresIn) {
      return res.status(400).json({ message: "OTP has expired" })
    }
    await user.updateOne({
      $unset: {
        OTP: null,
        OTPExpiresIn: null
      }
    })
    return res.status(200).json({ message: "OTP verified successfully" })
  }
  catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}







module.exports = {
  userLogin,
  userSignup,
  forgetPassword,
  verifyOTP
};
