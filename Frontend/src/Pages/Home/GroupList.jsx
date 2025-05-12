const GroupList = () => {
    return (
      <div className="p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Groups</h2>
        <div className="p-4">
          <input
            type="text"
            placeholder="Search groups..."
            className="w-full p-3 bg-[#2a2a2a] border border-gray-700 text-white rounded-md outline-none"
          />
        </div>
        <div className="space-y-4">
          {members.map((member, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-gray-600" />
              <div className="min-w-0">
                <p className="font-medium truncate">{member.name}</p>
                <p className="text-sm text-gray-400 truncate">
                  {member.email}
                </p>
              </div>
              <span className="ml-auto text-xs text-gray-500">
                {member.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };