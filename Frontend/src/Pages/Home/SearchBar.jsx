const SearchBar = ({ userName, setUserName, users, loading, setSelectedChat, addFriend }) => {
    return (
      <div className="p-4 border-b border-gray-800 relative">
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold mb-4">Rope Messenger</h2>
        </div>
  
        <div className="p-4 relative">
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full p-3 bg-[#2a2a2a] border border-gray-700 text-white rounded-md outline-none"
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
          />
          {/* Search Results */}
          {userName && (
            <div>
              {loading ? (
                <div className="flex justify-center items-center p-4">
                  <Loader />
                </div>
              ) : (
                users.length > 0 && (
                  <div className="absolute z-20 mt-2 w-[calc(100%-2rem)] bg-[#1f1f1f] border border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {users.map((user, i) => (
                      <div
                        key={user._id}
                        className="flex items-center space-x-4 cursor-pointer hover:bg-gray-800 p-2 rounded-md"
                        onClick={() => {
                          setSelectedChat(user);
                          setUserName("");
                          setUsers([]);
                        }}
                      >
                        <Avatar>
                          <AvatarImage src="https://github.com/shadcn.png" />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium truncate">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-400 truncate">
                            {user.userName}
                          </p>
                        </div>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            addFriend(user._id);
                          }}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-xs"
                        >
                          Add
                        </Button>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    );
  };