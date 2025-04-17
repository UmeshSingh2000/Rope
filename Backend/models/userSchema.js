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
    }
}, { timestamps: true });

const User=new mongoose.Model("User",userSchema);
module.exports=User;