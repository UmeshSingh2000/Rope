const {
  checkEmail,
  generateToken,
  sendMail,
  getUser
} = require('../Utils/helperFunction.js')
const bcrypt = require('bcrypt');
const User = require('../models/userSchema.js')
const fs = require('fs')
const path = require('path')
const { generateOTP } = require('../Utils/helperFunction.js');

const UserFriendsList = require('../models/userFriendsList.js')
const { getIo } = require('../Sockets/chatSockets.js');
const Mapper = require('../models/socketToUserIdMapperSchema.js')

/**
 * @description User login controller
 * @route POST api/userLogin
 * @access Public
 */
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const isUserExists = await User.findOne({ $or: [{ email: email }, { userName: email }] });
    if (!isUserExists) {
      return res.status(400).json({ message: "User does not" });
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
    const { name, userName, email, password } = req.body;
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
    if (!userName) {
      return res.status(400).json({ message: "UserName is Required" });
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
      return res.status(400).json({ message: "User with this Email already exists" });
    }

    const isUserNameExist = await User.findOne({ userName })
    if (isUserNameExist) {
      return res.status(400).json({ message: "UserName already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      userName
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

    return res.status(200).json({ message: "OTP send to Your Email" });
  }
  catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}


/**
 * @description Verify OTP
 * @route POST api/verifyOTP
 * @access Public
 */

const verifyOTP = async (req, res) => {
  try {
    const { OTP, email } = req.body;
    if (!OTP) {
      return res.status(400).json({ message: "OTP is required" })
    }


    const user = await User.findOne({ email });
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

/**
 * @description Change Password
 * @route POST api/changePassword
 * @access Public
 */

const resetPassword = async (req, res) => {
  try {

    const { password, email } = req.body
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!checkEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exists" });
    }
    user.password = await bcrypt.hash(password, 10);
    await user.save();
    return res.status(200).json({ message: "Password changed successfully" });
  }
  catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}


/**
 * @description Get User Id
 * @route GET api/getMyId
 * @access Private
 */

const getUserId = async (req, res) => {
  try {

    const { id } = req.user
    if (!id) {
      return res.status(400).json({ message: "User does not exists" });
    }
    res.status(200).json({ id })
  }
  catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}


/**
 * @description Get User by User Name
 * @route POST api/getUserByUserName
 * @access Private
 */

const getUserByUserName = async (req, res) => {
  try {
    const { id } = req.user
    const { userName } = req.body;
    console.log(userName);
    if (!userName) {
      return res.status(400).json({ message: "UserName is required" })
    }

    const user = await User.findOne({ userName: { $regex: new RegExp(`^${userName}`, 'i') } }, { password: 0, createdAt: 0, updatedAt: 0, OTP: 0, OTPExpiresIn: 0 });
    if (!user) {
      return res.status(404).json({ message: "User with this User Name does not exist" })
    }
    if (user._id.toString() === id.toString()) {
      return res.status(400).json({ message: "You cannot search yourself" })
    }
    return res.status(200).json({ message: "User found", user });
  }
  catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}


/**
 * @description Add Friend
 * @route POST api/addFriend
 * @access Private
 */

const addFriend = async (req, res) => {
  try {
    const io = getIo();
    const { friendId } = req.body;
    const userId = req.user.id;

    if (!friendId) {
      return res.status(400).json({ message: "Friend ID is required" });
    }
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    if (friendId === userId) {
      return res.status(400).json({ message: "You cannot add yourself as a friend" });
    }

    // Sender's side
    let userFriends = await UserFriendsList.findOne({ userId });
    if (!userFriends) {
      userFriends = new UserFriendsList({ userId, friendsList: [] });
    }

    const alreadyFriend = userFriends.friendsList.find(
      (friend) => friend.friendId.toString() === friendId
    );

    if (alreadyFriend) {
      return res.status(409).json({ message: "Friend request already sent or already a friend" });
    }

    userFriends.friendsList.push({
      friendId,
      status: 'pending'
    });

    await userFriends.save();

    // Receiver's side
    let friendFriendsList = await UserFriendsList.findOne({ userId: friendId });
    if (!friendFriendsList) {
      friendFriendsList = new UserFriendsList({ userId: friendId, friendsList: [] });
    }

    const alreadyExistsForReceiver = friendFriendsList.friendsList.find(
      (friend) => friend.friendId.toString() === userId
    );


    if (!alreadyExistsForReceiver) {
      friendFriendsList.friendsList.push({
        friendId: userId,
        status: 'request_received'
      });
      await friendFriendsList.save();
    }
    const friendSocketId = await Mapper.findOne({ userId: friendId });
    if (!friendSocketId) {
      return res.status(404).json({ message: "Friend not found" });
    }
    const senderInfo = await getUser(userId)
    io.to(friendSocketId.socketId).emit('friendRequestReceived', {
      from: userId,
      senderInfo,
      message: 'You have a new friend request!'
    });
    return res.status(200).json({ message: "Friend request sent successfully!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

/**
 * @description Get My Friends
 * @route GET api/getMyFriends
 * @access Private
 */


const getMyFriends = async (req, res) => {
  const { id } = req.user
  if (!id) {
    return res.status(400).json({ message: "User does not exists" });
  }
  try {
    const userFriends = await UserFriendsList.findOne({ userId: id }).populate('friendsList.friendId', 'name email userName')
    if (!userFriends) {
      return res.status(404).json({ message: "No Friends Found" })
    }
    const friendsList = userFriends.friendsList.filter((friend) => friend.status === 'accepted').map((friend) => friend.friendId)
    res.status(200).json({ message: "Friends List", friendsList })

  }
  catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}

/**
 * @description User Logout
 * @route GET api/logout
 * @access Private
 */

const userLogout = (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.status(200).json({ message: "Logout Success" });
  }
  catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}


const setUserOnlineStatus = async (userId, status) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new Error("User not found");
    }
    user.isOnline = status;
    await user.save();
  }
  catch (err) {
    console.log(err);
  }
}










module.exports = {
  userLogin,
  userSignup,
  forgetPassword,
  verifyOTP,
  resetPassword,
  getUserId,
  getUserByUserName,
  addFriend,
  getMyFriends,
  userLogout,
  setUserOnlineStatus
};
