const mongoose = require('mongoose')
const {Schema} = mongoose;

const userFriendsListSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    friendsList: [
        {
            friendId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            status: {
                type: String,
                enum: ['pending', 'accepted', 'rejected'],
                default: 'pending'
            }
        }
    ]
}, { timestamps: true });

const UserFriendsList = mongoose.model('UserFriendsList', userFriendsListSchema);
module.exports = UserFriendsList;