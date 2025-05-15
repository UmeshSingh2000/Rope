const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    profilePhoto: {
        type: String
    },
    OTP: {
        type: String,
        default: null
    },
    roomJoined: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Room'
    },
    OTPExpiresIn: {
        type: Date,
        default: null
    },
    isOnline: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;