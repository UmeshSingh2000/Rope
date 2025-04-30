import React, { useState, useEffect, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faPhone,
  faVideo,
  faArrowLeft,
  faCheckDouble,
  faCheck,
  faGear,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/Rope-Logo.png";
import { io } from "socket.io-client";
import axios from "axios";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CustomToast } from "@/components/CustomToast";
import Loader from "@/components/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "@/Redux/Features/User/friendsSlice";
import { setMessages } from "@/Redux/Features/Messages/messagesSlice";

const SocketURL = import.meta.env.VITE_SOCKET_API;
const URL = import.meta.env.VITE_BACKENDAPI_URL;

const members = [
  { name: "Sofia Davis", email: "m@example.com", role: "Owner" },
  { name: "Jackson Lee", email: "p@example.com", role: "Member" },
  { name: "Isabella Nguyen", email: "i@example.com", role: "Member" },
];

export default function Home() {
  const dispatch = useDispatch();
  const friends = useSelector((state) => state.friends.value);
  const messages = useSelector((state) => state.messages.value);

  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState("");
  const [filteredFriend, setFilteredFriend] = useState(friends);
  const [loading, setLoading] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");

  const socket = useMemo(() => io(SocketURL, { withCredentials: true }), []);

  const getId = async () => {
    try {
      const response = await axios.get(`${URL}/getMyId`, {
        withCredentials: true,
      });
      setCurrentUserId(response.data.id);
    } catch (error) {
      toast.error(error?.response?.data.message || "Something went wrong");
    }
  };

  useEffect(() => {
    getId();
  }, []);

  const addFriend = async (friendId) => {
    try {
      const response = await axios.post(
        `${URL}/addFriend`,
        { friendId },
        { withCredentials: true }
      );
      toast.success(response.data.message);
      getFriends();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    }
  };

  const sendMessage = () => {
    console.log("Sending message to: ", selectedChat._id);
    console.log("Message content: ", "Hi");
    socket.emit("sendMessage", {
      // senderId: currentUserId,
      to: selectedChat._id,
      message: "Hi",
    });
  };

  const getFriends = async () => {
    try {
      const response = await axios.get(`${URL}/getMyFriends`, {
        withCredentials: true,
      });
      dispatch(setFriends(response.data.friendsList));
      setFilteredFriend(response.data.friendsList || []);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    }
  };

  const getMessages = async (receiverId) => {
    try {
      const response = await axios.post(
        `${URL}/getAllMessages`,
        { receiverId },
        { withCredentials: true }
      );
      dispatch(setMessages(response.data));
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Something went Wrong"
      );
    }
  };

  useEffect(() => {
    if (selectedChat) {
      getMessages(selectedChat._id);
    }
  }, [selectedChat]);

  useEffect(() => {
    getFriends();
  }, []);

  const localSearch = () => {
    if (userName.trim() === "") {
      setFilteredFriend(friends);
      return false;
    }

    const filtered = friends.filter(
      (user) =>
        user.userName.toLowerCase().includes(userName.toLowerCase()) ||
        user.name.toLowerCase().includes(userName.toLowerCase())
    );
    setFilteredFriend(filtered);
    return filtered.length > 0;
  };

  useEffect(() => {
    if (localSearch()) {
      setUsers([]);
      return;
    }
    setFilteredFriend(friends);
    const timerId = setTimeout(() => {
      const fetchUser = async () => {
        setLoading(true);

        try {
          const response = await axios.post(
            `${URL}/getUserByUsername`,
            { userName },
            { withCredentials: true }
          );
          setUsers(response.data.user ? [response.data.user] : []);
        } catch (error) {
          setUsers([]);
          toast.error(
            error?.response?.data?.message ||
              error.message ||
              "Something went wrong"
          );
        } finally {
          setLoading(false);
        }
      };
      if (userName) fetchUser();
    }, 500);

    return () => clearTimeout(timerId);
  }, [userName]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", checkMobile);
    checkMobile();
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    socket.on("connect", () => console.log("Connected to server"));
    socket.on("friendRequestReceived", ({ from, message, senderInfo }) => {
      CustomToast(socket, from, message, senderInfo, getFriends);
    });
    socket.on("notification", (data) => {
      if (data.message) {
        if ((data.message = "Request accepted")) {
          getFriends();
        }
        toast.success(data.message);
      } else {
        toast.error("Something went wrong");
      }
    });
    return () => {
      socket.off("connect");
      socket.off("friendRequestReceived");
      socket.off("notification");
    };
  }, [socket]);

  return (
    <div className="flex h-screen items-center justify-center bg-black px-2">
      <div className="relative flex h-[95vh] w-full max-w-6xl overflow-hidden rounded-xl bg-[#1a1a1a] text-white shadow-lg">
        <div className="hidden md:flex flex-col w-20 h-full bg-[#0d0d0d] border-r border-gray-800">

          <div className="flex justify-center items-center h-20 border-b border-gray-800">
            <img src={logo} alt="Logo" className="w-20 h-20 rounded-full" />
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
            <button className="hover:text-white" title="Logout">
              <FontAwesomeIcon icon={faRightFromBracket} />
            </button>
          </div>
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
            {/* Search Bar */}
            <div className="p-4 border-b border-gray-800 relative">
              <div className="flex justify-between">
                <h2 className="text-lg font-semibold mb-4">Search</h2>
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
                              key={`search-${i}`}
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

            {/* Chats & Friends */}
            <div className="p-4 overflow-y-auto">
              <h2 className="text-lg font-semibold mb-4">Chats</h2>

              {/* Always show filtered friends */}
              <div className="space-y-4">
                {filteredFriend.map((friend, i) => (
                  <div
                    key={`friend-${i}`}
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

        {/* Right Panel (Chat Window) */}
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
              <div className="flex-1 overflow-y-auto space-y-4 mt-4 px-2 flex flex-col">
                {messages.map((message) => {
                  const isOwnMessage = message.senderId._id === currentUserId;
                  const bubbleStyles = isOwnMessage
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-black";

                  return (
                    <div
                      key={message._id}
                      className={`flex ${
                        isOwnMessage ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`rounded-2xl p-3 max-w-[70%] break-words relative ${bubbleStyles}`}
                      >
                        <div className="flex items-end gap-5">
                          <span className="text-base">{message.text}</span>
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
                })}
              </div>

              {/* Input */}
              <div className="mt-4 flex items-center">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 p-3 bg-[#2a2a2a] border border-gray-700 text-white rounded-l-full outline-none"
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-600 hover:bg-blue-700 p-3 rounded-r-full text-white"
                >
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
