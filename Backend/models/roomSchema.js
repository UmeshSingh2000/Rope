const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    roomName: {
        type: String,
        required: true,
    },
    roomId:{
        type: String,
        required: true,
        unique: true,
    },
    roomAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    roomMembers: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            joinedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
},{
    timestamps: true
})

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;