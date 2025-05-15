const Mapper = require('../models/socketToUserIdMapperSchema')
const { roomAddUsers } = require('./roomController')
const socketRoomAddUsers = (socket) => {
    socket.on('addUsersToRoom', async ({ userId, roomId }) => {
        try {
            await roomAddUsers({ roomId, userId })
            socket.to(roomId).emit('roomAddUserSuccess', { message: "User added to room successfully" })
        }
        catch (err) {
            socket.emit('roomAddUserError', { message: err.message })
        }
    })
}

module.exports = {
    socketRoomAddUsers
}