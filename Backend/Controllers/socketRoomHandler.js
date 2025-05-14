const Mapper = require('../models/socketToUserIdMapperSchema')
const { roomAddUsers } = require('./roomController')
const socketRoomAddUsers = (socket) => {
    socket.on('addUsersToRoom', async ({ userId, roomId }) => {
        try {
            await roomAddUsers({ roomId, userId })
        }
        catch (err) {
            socket.emit('roomAddUserError', { message: err.message })
        }
    })
}

module.exports = {
    socketRoomAddUsers
}