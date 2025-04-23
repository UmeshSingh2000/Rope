const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer')
const mongoose = require('mongoose')

const generateToken = ({ id, name }) => {
  try {
    const payload = { id, name };
    if (!payload) {
      return res.status(400).json({ message: "Payload is required" });
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: "env doesnt have JWT_SECRET" });
    }
    const options = { expiresIn: "1h" };
    const token = jwt.sign(payload, secret, options);
    return token;
  }
  catch (err) {
    console.log(err)
  }
}

const checkEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
})

const sendMail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to,
      subject,
      html
    })
    return { success: true };
  }
  catch (err) {
    return { success: false, error };
  }
}

const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp;
}


const checkValidMongooseId = (id) => {
  if (!id) {
    return false;
  }
  const isValid = mongoose.Types.ObjectId.isValid(id);
  return isValid;
}




module.exports = {
  checkEmail,
  generateToken,
  sendMail,
  generateOTP,
  checkValidMongooseId
};
