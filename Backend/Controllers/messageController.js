const Message = require('../models/messageSchema');
const { checkValidMongooseId } = require('../Utils/helperFunction');

const sendMessage = async (req, res) => {
    try {
        const { senderId, receiverId, text, textType } = req.body;
        if (!senderId || !receiverId || !text, !textType) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!checkValidMongooseId(senderId)) {
            return res.status(400).json({ message: "Invalid senderId" });
        }
        if (!checkValidMongooseId(receiverId)) {
            return res.status(400).json({ message: "Invalid receiverId" });
        }


        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            textType
        })
        await newMessage.save();
        res.status(201).json({ message: "Message Send Successfull" })
    }
    catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

const getAllMessages = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;
        if (!senderId || !receiverId) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!checkValidMongooseId(senderId)) {
            return res.status(400).json({ message: "Invalid senderId" });
        }
        if (!checkValidMongooseId(receiverId)) {
            return res.status(400).json({ message: "Invalid receiverId" });
        }


        const messages = await Message.find({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        }).sort({ createdAt: -1 }).populate("senderId", "name email").populate("receiverId", "name email");

        res.status(200).json(messages);
    }
    catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
}


module.exports = {
    sendMessage,
    getAllMessages
}