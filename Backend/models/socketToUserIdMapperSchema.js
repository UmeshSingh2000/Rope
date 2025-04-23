const mongoose = require('mongoose')
const Schema = mongoose.Schema

const mapper = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    socketId: {
        type: String,
        required: true,
        default:null
    }
}, {
    timestamps: true
})

const Mapper = mongoose.model("SocketToUserIdMapper", mapper)
module.exports = Mapper;