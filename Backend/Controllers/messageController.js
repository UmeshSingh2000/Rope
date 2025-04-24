const Message = require('../models/messageSchema');
const { checkValidMongooseId } = require('../Utils/helperFunction');


/**
 * @description Send a message from one user to another
 * @route POST /api/sendMessage
 */

const sendMessage = async (req, res) => {
    try {
        const { receiverId, text, textType } = req.body;
        const senderId = req.user.id
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

/**
 * @description Get all messages between two users
 * @route POST /api/getAllMessages
 */


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