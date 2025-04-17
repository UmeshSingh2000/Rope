const jwt = require("jsonwebtoken");


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


module.exports = { checkEmail, generateToken };
