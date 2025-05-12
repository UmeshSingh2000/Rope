const createRoom = (req, res) => {
    const { roomName } = req.body;
    if (!roomName) {
        return res.status(400).json({ error: "Room name is required" });
    }
}

module.exports = {
    createRoom
}