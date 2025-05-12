const RightPanel = ({ 
    selectedChat, 
    isMobile, 
    setSelectedChat, 
    messages, 
    currentUserId, 
    message, 
    setMessage, 
    sendMessage, 
    showEmojiPicker, 
    setShowEmojiPicker, 
    onEmojiClick 
  }) => {
    return (
      <div
        className={`absolute md:static w-full md:w-2/3 h-full transition-all duration-500 ease-in-out transform ${
          selectedChat
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0 md:opacity-100"
        }`}
      >
        {selectedChat && (
          <div className="flex flex-col h-full p-4 sm:p-6">
            <ChatHeader 
              selectedChat={selectedChat} 
              isMobile={isMobile} 
              setSelectedChat={setSelectedChat} 
            />
  
            <div className="flex-1 overflow-y-auto space-y-4 mt-4 px-2 flex flex-col">
              {[...messages]
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                .map((message) => (
                  <MessageBubble 
                    key={message._id} 
                    message={message} 
                    currentUserId={currentUserId} 
                  />
                ))}
              <div ref={messagesEndRef} />
            </div>
  
            <MessageInput 
              message={message} 
              setMessage={setMessage} 
              sendMessage={sendMessage} 
              showEmojiPicker={showEmojiPicker} 
              setShowEmojiPicker={setShowEmojiPicker} 
              onEmojiClick={onEmojiClick} 
            />
          </div>
        )}
      </div>
    );
  };