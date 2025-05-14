const Room = require("../models/roomSchema")
const crypto = require("crypto")
const createRoom = async (req, res) => {
    try {
        const { roomName } = req.body;
        const { id } = req.user;
        if (!roomName) {
            return res.status(400).json({ error: "Room name is required" });
        }
        const roomId = crypto.randomBytes(16).toString("hex");
        const newRoom = new Room({
            roomName,
            roomAdmin: id,
            roomId,
            roomMembers: [
                {
                    userId: id,
                    joinedAt: new Date()
                }
            ]
        })
        await newRoom.save()
        return res.status(201).json({ message: "Room created successfully" });
    }
    catch(err){
        return res.status(500).json({ error: "Internal server error" });
    }
}

const roomAddUsers = async({roomId,userId})=>{
    try{

        if(!roomId || !userId) {
            return { error: "Room name and user ID are required" };
        }
        const room = await Room.findOne({ roomId });
        if (!room) {
            return { error: "Room not found" };
        }
        const user = room.roomMembers.some(member=>member.userId.toString() === userId);
        if(user) {
            return { error: "User already in room" };
        }
        room.roomMembers.push({
            userId,
            joinedAt: new Date()
        })
        await room.save();
        return { message: "User added to room successfully" };
    }
    catch(err){
        return { error: "Internal server error" };
    }
}

module.exports = {
    createRoom,
    roomAddUsers
}