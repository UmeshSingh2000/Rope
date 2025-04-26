import React, { useState, useEffect, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faPhone,
  faVideo,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/Rope-Logo.png";
import { io } from "socket.io-client";
import axios from "axios";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
const SocketURL = import.meta.env.VITE_SOCKET_API;
const URL = import.meta.env.VITE_BACKENDAPI_URL;

const members = [
  { name: "Sofia Davis", email: "m@example.com", role: "Owner" },
  { name: "Jackson Lee", email: "p@example.com", role: "Member" },
  { name: "Isabella Nguyen", email: "i@example.com", role: "Member" },
];

export default function Home() {
  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState();

  const socket = useMemo(
    () =>
      io(SocketURL, {
        withCredentials: true,
      }),
    []
  );
  const [selectedChat, setSelectedChat] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const addFriend = async (friendId) => {
    try {
      const response = await axios.post(
        `${URL}/addFriend`,
        { friendId },
        { withCredentials: true }
      );
      toast.success(response.data.message);
    } catch (error) {
      
      toast.error(error?.response?.data?.message || error.message || "Something went wrong" );
    }
  };

  useEffect(() => {
    const TimerId = setTimeout(() => {
      const fetchUser = async () => {
        try {
          const response = await axios.post(
            `${URL}/getUserByUsername`,
            { userName }, // use searchInput
            { withCredentials: true }
          );

          toast.success(response.data.message);
          setUsers([response.data.user]);
        } catch (error) {
          toast.error(
            error?.response?.data?.message ||
              error.message ||
              "Something went wrong"
          );
        }
      };

      if (userName) {
        fetchUser();
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(TimerId); // cleanup timer on each keystroke
  }, [userName]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="flex h-screen items-center justify-center bg-black px-2">
      <div className="relative flex h-[95vh] w-full max-w-6xl overflow-hidden rounded-xl bg-[#1a1a1a] text-white shadow-lg">
        <div>
          <img src={logo} alt="Logo" className="w-20 h-20 rounded-full" />
        </div>
        {/* Left Panel */}
        <div
          className={`absolute md:static w-full md:w-1/3 h-full transition-all duration-500 ease-in-out transform ${
            selectedChat && isMobile
              ? "-translate-x-full opacity-0"
              : "translate-x-0 opacity-100"
          }`}
        >
          <div className="flex flex-col h-full border-r border-gray-800 bg-[#111]">
            {/* Chats */}
            <div className="p-4 border-b border-gray-800">
              <div className="flex justify-between">
                <h2 className="text-lg font-semibold mb-4">Chats</h2>
                {/* <img className="w-10 h-10 rounded-full" src={logo} alt="Logo" /> */}
              </div>

              <div className="p-4">
                <input
                  type="text"
                  placeholder="Search chats..."
                  className="w-full p-3 bg-[#2a2a2a] border border-gray-700 text-white rounded-md outline-none"
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <div className="space-y-4">
                {users.map((user, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-4 cursor-pointer hover:bg-gray-800 p-2 rounded-md"
                    onClick={() => setSelectedChat(user)}
                  >
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                      <p className="font-medium truncate">{user.name}</p>
                      <p className="text-sm text-gray-400 truncate">
                        {user.userName}
                      </p>
                    </div>
                    <span>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation(); // prevent selecting the chat when clicking Add
                          addFriend(user._id);
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-sm"
                      >
                        Add
                      </Button>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Groups */}
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
          </div>
        </div>

        {/* Right Panel */}
        <div
          className={`absolute md:static w-full md:w-2/3 h-full transition-all duration-500 ease-in-out transform ${
            selectedChat
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0 md:opacity-100"
          }`}
        >
          {selectedChat && (
            <div className="flex flex-col h-full p-4 sm:p-6">
              {/* Header */}
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

              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mt-4 px-1">
                <div className="bg-[#2a2a2a] p-3 rounded-xl max-w-xs w-fit">
                  Hi, how can I help you today?
                </div>
                <div className="bg-blue-600 p-3 rounded-xl self-end text-white max-w-xs w-fit">
                  Hey, I'm having trouble with my account.
                </div>
                <div className="bg-[#2a2a2a] p-3 rounded-xl max-w-xs w-fit">
                  What seems to be the problem?
                </div>
                <div className="bg-blue-600 p-3 rounded-xl self-end text-white max-w-xs w-fit">
                  I can't log in.
                </div>
              </div>

              {/* Input */}
              <div className="mt-4 flex items-center">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 p-3 bg-[#2a2a2a] border border-gray-700 text-white rounded-l-full outline-none"
                />
                <button className="bg-blue-600 hover:bg-blue-700 p-3 rounded-r-full text-white">
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
