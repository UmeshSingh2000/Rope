const mongoose= require("mongoose");

const userSchema = new mongoose.Schema({
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
    OTPExpiresIn: {
        type: Date,
        default: null
      }
}, { timestamps: true });

const User=mongoose.model("User",userSchema);
module.exports=User;