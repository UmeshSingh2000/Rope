const LeftPanel = ({ 
    userName, 
    setUserName, 
    users, 
    loading, 
    setSelectedChat, 
    addFriend, 
    filteredFriend, 
    selectedChat, 
    isMobile 
  }) => {
    return (
      <div
        className={`absolute md:static w-full md:w-1/3 h-full transition-all duration-500 ease-in-out transform ${
          selectedChat && isMobile
            ? "-translate-x-full opacity-0"
            : "translate-x-0 opacity-100"
        }`}
      >
        <div className="flex flex-col h-full border-r border-gray-800 bg-[#111]">
          <SearchBar 
            userName={userName} 
            setUserName={setUserName} 
            users={users} 
            loading={loading} 
            setSelectedChat={setSelectedChat} 
            addFriend={addFriend} 
          />
          <ChatList filteredFriend={filteredFriend} setSelectedChat={setSelectedChat} />
          <GroupList />
        </div>
      </div>
    );
  };