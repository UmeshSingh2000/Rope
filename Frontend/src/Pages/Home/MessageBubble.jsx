const MessageBubble = ({ message, currentUserId }) => {
    const isOwnMessage = message.senderId === currentUserId;
    const bubbleStyles = isOwnMessage
      ? "bg-blue-500 text-white"
      : "bg-gray-300 text-black";
  
    return (
      <div
        className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`rounded-md p-3 max-w-[70%] break-words relative ${bubbleStyles}`}
        >
          <div className="flex items-end gap-2 h-5">
            <span className="text-base">{message.text}</span>
            <span className="text-xs text-black opacity-50">
              {new Date(message.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </span>
            {isOwnMessage &&
              (message.isRead ? (
                <FontAwesomeIcon
                  icon={faCheckDouble}
                  size="sm"
                  className="text-blue-300"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faCheck}
                  size="sm"
                  className="text-gray-300"
                />
              ))}
          </div>
        </div>
      </div>
    );
  };