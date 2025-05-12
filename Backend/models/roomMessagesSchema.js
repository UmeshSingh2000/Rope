const mongoose = require('mongoose')
const {Schema} = mongoose;

const roomMessagesSchema = new Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    messageContent: {
        type: String,
        required: true
    },
    messageType: {
        type: String,
        enum: ['text', 'image', 'video', 'audio'],
        default: 'text'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

const RoomMessages = mongoose.model('RoomMessages', roomMessagesSchema)
module.exports = RoomMessages