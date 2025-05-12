const SidebarIcons = () => {
    return (
      <div className="hidden md:flex flex-col w-20 h-full bg-[#0d0d0d] border-r border-gray-800">
        <div className="flex justify-center items-center h-20 border-b border-gray-800">
          <img src={logo} alt="Logo" className="w-20 h-20 rounded-full cursor-pointer" />
        </div>
  
        <div className="flex flex-col items-center space-y-6 text-gray-400 text-lg mt-6">
          <button className="hover:text-white" title="Chats">
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
          <button className="hover:text-white" title="Groups">
            <FontAwesomeIcon icon={faVideo} />
          </button>
          <button className="hover:text-white" title="Calls">
            <FontAwesomeIcon icon={faPhone} />
          </button>
        </div>
  
        <div className="mt-auto mb-6 flex flex-col items-center space-y-6 text-gray-400 text-lg">
          <button className="hover:text-white" title="Settings">
            <FontAwesomeIcon icon={faGear} />
          </button>
          <button onClick={handleLogout} className="hover:text-white cursor-pointer" title="Logout">
            <FontAwesomeIcon icon={faRightFromBracket} />
          </button>
        </div>
      </div>
    );
  };