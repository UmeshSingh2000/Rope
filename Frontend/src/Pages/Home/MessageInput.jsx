const MessageInput = ({ 
  message, 
  setMessage, 
  sendMessage, 
  showEmojiPicker, 
  setShowEmojiPicker, 
  onEmojiClick 
}) => {
  return (
    <div className="mt-4 flex items-center pb-8 md:pb-0">
      <button 
        type="button" 
        className="p-2 cursor-pointer text-2xl hover:bg-amber-100 rounded-full" 
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
      >
        😀
      </button>

      <input
        type="text"
        placeholder="Type your message..."
        className="flex-1 p-3 bg-[#2a2a2a] border border-gray-700 text-white rounded-l-md h-12 outline-none"
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage();
          }
        }}
        value={message}
      />
      <button
        onClick={sendMessage}
        className="bg-blue-600 hover:bg-blue-700 p-3 rounded-r-md text-white cursor-pointer"
      >
        <FontAwesomeIcon icon={faPaperPlane} />
      </button>
      {showEmojiPicker && (
        <div style={{ position: 'absolute', bottom: '80px' }}>
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}
    </div>
  );
};