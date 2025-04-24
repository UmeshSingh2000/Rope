const socketMapper = require('../models/socketToUserIdMapperSchema')
const socketMiddleware = require('../middlewares/SocketMiddleWare')
const chatSockets = (io) => {
    io.use(socketMiddleware) // if need the userId in socket user socket.user.id else in normal use req.user.id
    io.on('connection', async (socket) => {
        console.log('A user connected', socket.id)
        try { // on each connection, we will check if the userId is already in the database, if not we will add the mapping to the collection
            await socketMapper.findOneAndUpdate(
                { userId: socket.user.id },
                { socketId: socket.id },
                { upsert: true, new: true }
            )
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

module.exports = chatSockets;