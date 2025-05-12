const MobileBottomNav = () => {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0d0d0d] border-t border-gray-800 flex justify-around items-center py-2 md:hidden">
        <button className="flex flex-col items-center text-gray-400 hover:text-white" title="Chats">
          <FontAwesomeIcon icon={faPaperPlane} className="text-xl" />
          <span className="text-xs">Chats</span>
        </button>
        <button className="flex flex-col items-center text-gray-400 hover:text-white" title="Groups">
          <FontAwesomeIcon icon={faVideo} className="text-xl" />
          <span className="text-xs">Groups</span>
        </button>
        <button className="flex flex-col items-center text-gray-400 hover:text-white" title="Calls">
          <FontAwesomeIcon icon={faPhone} className="text-xl" />
          <span className="text-xs">Calls</span>
        </button>
        <button className="flex flex-col items-center text-gray-400 hover:text-white" title="Settings">
          <FontAwesomeIcon icon={faGear} className="text-xl" />
          <span className="text-xs">Settings</span>
        </button>
        <button onClick={handleLogout} className="flex flex-col items-center text-gray-400 hover:text-white" title="Logout">
          <FontAwesomeIcon icon={faRightFromBracket} className="text-xl" />
          <span className="text-xs">Logout</span>
        </button>
      </div>
    );
  };