const ChatList = ({ filteredFriend, setSelectedChat }) => {
    return (
      <div className="p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Chats</h2>
        <div className="space-y-4">
          {filteredFriend.map((friend) => (
            <div
              key={friend._id}
              className="flex items-center space-x-4 cursor-pointer hover:bg-gray-800 p-2 rounded-md"
              onClick={() => setSelectedChat(friend)}
            >
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-medium truncate">{friend.name}</p>
                <p className="text-sm text-gray-400 truncate">
                  {friend.userName}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };