const Message = require('../models/messageSchema');
const { checkValidMongooseId } = require('../Utils/helperFunction');


/**
 * @description Store message in database
 */

const sendMessage = async ({ senderId, receiverId, text, textType }) => {
    if (!senderId || !receiverId || !text || !textType) {
        throw new Error("All fields are required");
    }

    if (!checkValidMongooseId(senderId)) {
        throw new Error("Invalid senderId");
    }
    if (!checkValidMongooseId(receiverId)) {
        throw new Error("Invalid receiverId");
    }

    const newMessage = new Message({
        senderId,
        receiverId,
        text,
        textType
    });

    await newMessage.save();
    return newMessage;
};

/**
 * @description Get all messages between two users
 * @route POST /api/getAllMessages
 */

const getAllMessages = async (req, res) => {
    try {
        const senderId = req.user.id;
        const { receiverId } = req.body;
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
        }).sort({ createdAt: -1 })

        res.status(200).json(messages);
    }
    catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        if (!messageId) {
            return res.status(400).json({ message: "messageId is required" });
        }
        const deletedMessage  = await Message.findByIdAndDelete(messageId)
        if (!deletedMessage ) {
            return res.status(404).json({ message: "Message not found" });
        }
        res.status(200).json({ message: "Message deleted for EveryOne" });
    }
    catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
}


module.exports = {
    sendMessage,
    getAllMessages,
    deleteMessage
}