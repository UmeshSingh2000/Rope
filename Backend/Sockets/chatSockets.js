const socketMapper = require('../models/socketToUserIdMapperSchema')
const chatSockets = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected', socket.id)


        socket.on('register', async (userId) => {
            try {
                await socketMapper.findOneAndUpdate(
                    { userId: userId },
                    { socketId: socket.id },
                    { upsert: true, new: true }
                )
                
            }
            catch (error) {
                console.log(error)
            }
        })


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