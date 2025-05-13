import React from "react";
import { FiPhoneIncoming, FiPhoneOutgoing, FiVideo, FiPhoneMissed } from "react-icons/fi";

const callsData = [
  {
    id: 1,
    name: "Alice Johnson",
    avatar: "https://i.pravatar.cc/150?img=5",
    time: "Today, 2:45 PM",
    type: "video",
    direction: "incoming",
    missed: false,
  },
  {
    id: 2,
    name: "David Smith",
    avatar: "https://i.pravatar.cc/150?img=10",
    time: "Today, 11:20 AM",
    type: "audio",
    direction: "outgoing",
    missed: false,
  },
  {
    id: 3,
    name: "Emma Brown",
    avatar: "https://i.pravatar.cc/150?img=15",
    time: "Yesterday, 8:00 PM",
    type: "video",
    direction: "incoming",
    missed: true,
  },
];

const Calls = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-3xl mx-auto bg-gray-950 border border-gray-800 shadow-2xl rounded-xl p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Recent Calls</h1>
          <p className="text-gray-400">Your latest call activity</p>
        </div>

        <div className="space-y-4">
          {callsData.map(call => (
            <div
              key={call.id}
              className="flex items-center justify-between p-4 bg-gray-900 hover:bg-gray-800 transition rounded-lg border border-gray-800"
            >
              <div className="flex items-center gap-4">
                <img
                  src={call.avatar}
                  alt={call.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-700"
                />
                <div>
                  <p className="text-sm font-medium">{call.name}</p>
                  <p className="text-xs text-gray-400">{call.time}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-lg">
                {call.type === "video" ? (
                  <FiVideo className="text-purple-400" />
                ) : call.missed ? (
                  <FiPhoneMissed className="text-red-500" />
                ) : call.direction === "incoming" ? (
                  <FiPhoneIncoming className="text-green-400" />
                ) : (
                  <FiPhoneOutgoing className="text-blue-400" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calls;
