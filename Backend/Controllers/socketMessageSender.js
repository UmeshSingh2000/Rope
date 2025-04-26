const Mapper = require('../models/socketToUserIdMapperSchema')
const { sendMessage } = require('./messageController')
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


module.exports = {
    socketPrivateMessageSender
}