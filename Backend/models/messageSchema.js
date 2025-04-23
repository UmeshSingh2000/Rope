const mongoose= require("mongoose");

const messageSchema = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    text:{
        type:String,
        required:true,
    },
    textType:{
        type:String,
        enum:["text","image","file"],
        default:"text",
    },
    isRead:{
        type:Boolean,
        default:false,
    },

},{ timestamps: true });

const Message=mongoose.model("Message",messageSchema);
module.exports=Message;