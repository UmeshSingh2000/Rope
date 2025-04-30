const Mapper = require('../models/socketToUserIdMapperSchema')
const { sendMessage } = require('./messageController')
const UserFriendsList = require('../models/userFriendsList')
const socketPrivateMessageSender = (socket) => {
    socket.on('sendMessage', async ({ to, message }) => {
        try {
            const receiver = await Mapper.findOne({ userName: to });
            if (!receiver) {
                return socket.emit('userNotFound', { message: 'User not found' });
            }

            const receiverSocketId = receiver.socketId;
            if (!receiverSocketId) {
                return socket.emit('userNotFound', { message: 'User not found' });
            }

            // Save message in DB
            const savedMessage = await sendMessage({
                senderId: socket.user.id,
                receiverId: receiver.userId, // make sure userId exists in your Mapper schema
                text: message,
                textType: 'text'
            });

            // Emit message to receiver
            socket.to(receiverSocketId).emit('receiveMessage', {
                message: savedMessage.text,
                from: savedMessage.senderId,
                textType: savedMessage.textType,
                timestamp: savedMessage.createdAt
            });

        } catch (error) {
            console.error(error.message);
            socket.emit('messageError', { message: error.message });
        }
    });
};

const requestHandler = (socket) => {
    socket.on('requests', async ({ requestStatus, friendId }) => {
        const userId = socket.user.id;
        try {
            if (requestStatus !== 'accepted' && requestStatus !== 'rejected') {
                return socket.emit('notification', { message: 'Invalid request status' });
            }
            else {
                const result = await UserFriendsList.updateOne({ userId, 'friendsList.friendId': friendId }, {
                    $set: {
                        'friendsList.$.status': requestStatus
                    }
                })
                await UserFriendsList.updateOne({ userId:friendId, 'friendsList.friendId': userId }, {
                    $set: {
                        'friendsList.$.status': requestStatus
                    }
                })
                const socketId = await Mapper.findOne({ userId: friendId });
                if (result.modifiedCount === 0) {
                    socket.to(socketId.socketId).emit('notification', { message: 'Friend not found' });
                } else {
                    socket.to(socketId.socketId).emit('notification', { message: `Request ${requestStatus}` });
                }
            }
        }
        catch (error) {
            console.error(error.message);
            socket.emit('messageError', { message: error.message });
        }
    })
}


module.exports = {
    socketPrivateMessageSender,
    requestHandler
}