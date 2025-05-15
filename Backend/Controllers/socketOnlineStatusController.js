const { setUserOnlineStatus } = require('../Controllers/userControllers');
const { getIo } = require('../Sockets/chatSockets');

const socketOnlineStatus = async (socket) => {
  try {
    const io = getIo();
    await setUserOnlineStatus(socket.user.id, true); // set user online
    io.emit('userStatusChanged', {
      userId: socket.user.id,
      status: true
    });
  } catch (err) {
    console.error('Error setting user online status:', err);
  }
}

const socketOfflineStatus = async (socket) => {
  try {
    const io = getIo();
    await setUserOnlineStatus(socket.user.id, false); // set user offline
    io.emit('userStatusChanged', {
      userId: socket.user.id,
      status: false
    });
  } catch (err) {
    console.error('Error setting user offline status:', err);
  }
}

module.exports = {
  socketOnlineStatus,
  socketOfflineStatus
}
