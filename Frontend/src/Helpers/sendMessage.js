const sendMessage = (socket,setMessage,message,to) => {
    if (!message.trim()) return;
    socket.emit("sendMessage", {
        to,
        message,
    });
    setMessage("");
};
export default sendMessage;