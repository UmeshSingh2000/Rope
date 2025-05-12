const ChatHeader = ({ selectedChat, isMobile, setSelectedChat }) => {
    return (
      <div className="flex items-center pb-4 border-b border-gray-800">
        {isMobile && (
          <button
            className="mr-4 text-gray-400"
            onClick={() => setSelectedChat(null)}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
        )}
        <div className="w-10 h-10 rounded-full bg-gray-600" />
        <div className="ml-3 overflow-hidden">
          <p className="font-semibold truncate">{selectedChat.name}</p>
          <p className="text-sm text-gray-400 truncate">
            {selectedChat.email}
          </p>
        </div>
        <div className="ml-auto flex gap-4 text-gray-400 text-lg">
          <FontAwesomeIcon icon={faPhone} />
          <FontAwesomeIcon icon={faVideo} />
        </div>
      </div>
    );
  };