const socketMapper = require('../models/socketToUserIdMapperSchema')
const socketMiddleware = require('../Middlewares/SocketMiddleWare')
const { socketPrivateMessageSender } = require('../Controllers/socketMessageSender');
const User = require('../models/userSchema')
let ioInstance;
const chatSockets = (io) => {
    ioInstance = io;
    io.use(socketMiddleware) // if need the userId in socket user socket.user.id else in normal use req.user.id
    io.on('connection', async (socket) => {
        console.log('A user connected', socket.id)
        try { // on each connection, we will check if the userId is already in the database, if not we will add the mapping to the collection
            const user = await User.findById(socket.user.id)
            if (!user) {
                console.log('User not found')
                return socket.disconnect(true)
            }
            await socketMapper.findOneAndUpdate(
                { userId: socket.user.id },
                { userName: user.userName, socketId: socket.id },
                { upsert: true, new: true }
            )
            socketPrivateMessageSender(socket)
        }
        catch (error) {
            console.log(error)
        }

        socket.on('disconnect', async () => {
            try {
                await socketMapper.findOneAndDelete({ socketId: socket.id })
                console.log('User disconnected', socket.id)
            }
            catch (error) {
                console.log(error)
            }
        })
    });
}
const getIo = () => {
    if (!ioInstance) {
        throw new Error("Socket.io not initialized");
    }
    return ioInstance;
};

module.exports = { getIo,chatSockets }