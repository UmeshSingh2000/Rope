import React, { useState, useEffect, useMemo, useRef } from "react";
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
import { setMessages, addMessage } from "@/Redux/Features/Messages/messagesSlice";
import EmojiPicker from 'emoji-picker-react';

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
  const [selectedChat, setSelectedChat] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messages = useSelector((state) => state.messages.value[selectedChat?._id] || []);


  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState("");
  const [filteredFriend, setFilteredFriend] = useState(friends);
  const [loading, setLoading] = useState(false);

  const [isMobile, setIsMobile] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");
  const [message, setMessage] = useState(""); // message send input field
  const messagesEndRef = useRef(null);

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

  // Fetch the current user's ID when the component mounts
  useEffect(() => {
    getId();
  }, []);


  /**
   * @description Add a friend to the user's friend list
   */
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


  /**
   * @description Send message to the selected chat
   */
  const sendMessage = () => {
    if (!message.trim()) return;
    socket.emit("sendMessage", {
      // senderId: currentUserId,
      to: selectedChat._id,
      message,
    });
    // socket.on('messageSentSuccess', ({ messageDetails }) => {
    //   console.log("message", messageDetails);
    //   dispatch(setMessages({ id: selectedChat._id, message: messageDetails }))
    // })
    setMessage("");
  };


  /**
   * @description Fetch all friends of the user
   */
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


  /**
   * @description Fetch all messages for the selected chat
   */
  const getMessages = async (receiverId) => {
    try {
      const response = await axios.post(
        `${URL}/getAllMessages`,
        { receiverId },
        { withCredentials: true }
      );
      dispatch(setMessages({ id: receiverId, message: response.data }));
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        error.message ||
        "Something went Wrong"
      );
    }
  };

  // Fetch messages when the selected chat changes
  useEffect(() => {
    if (messages.length > 0) return
    if (selectedChat) {
      getMessages(selectedChat._id);
    }
  }, [selectedChat]);


  // Fetch friends when the component mounts
  // and when the socket connection is established
  useEffect(() => {
    getFriends();
  }, []);


  /**
   * @description Local search function to filter friends based on username or name
   */
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

  /**
   * @description Logout function to clear cookies and redirect to login page
   */
  const handleLogout = async () => {
    try {
      const response = await axios.get(`${URL}/logout`, { withCredentials: true });
      toast.success(response.data.message);

      window.location.reload()
    }
    catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Something went wrong")
    }
  }

  const onEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };


  // Fetch users based on username input
  // and filter friends based on local search
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


  //responsive design for mobile and desktop
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", checkMobile);
    checkMobile();
    return () => window.removeEventListener("resize", checkMobile);
  }, []);


  // Connect to socket when the component mounts
  // and set up event listeners for incoming messages and notifications
  useEffect(() => {
    socket.on("connect", () => console.log("Connected to server"));
    socket.on("friendRequestReceived", ({ from, message, senderInfo }) => {
      CustomToast(socket, from, message, senderInfo, getFriends);
    });
    socket.on("notification", (data) => {
      if (data.message) {
        if ((data.message === "Request accepted")) {
          getFriends();
        }
        if (data.message)
          toast.success(data.message);
      } else {
        toast.error("Something went wrong");
      }
    });



    return () => {
      socket.off("connect");
      socket.off("friendRequestReceived");
      socket.off("notification");
      socket.off('messageSentSuccess', handleMessageSent);
    };
  }, [socket]);

  // Listen for new messages from the server
  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", ({ message, id }) => {
      dispatch(setMessages({ id, message }));
    });

    return () => {
      socket.off("newMessage");
    };
  }, [socket]);

  useEffect(() => {
    const handleMessageSent = ({ messageDetails }) => {
      dispatch(setMessages({ id: selectedChat?._id, message: messageDetails }));
    };

    socket.on('messageSentSuccess', handleMessageSent);
    return () => {
      socket.off('messageSentSuccess', handleMessageSent);
    };
  }, [socket, selectedChat]);


  // scroll to bottom when new message is added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messages]);

  return (
    <div className="flex h-screen items-center justify-center bg-black px-2">
      <div className="relative flex h-[95vh] w-full max-w-6xl overflow-hidden rounded-xl bg-[#1a1a1a] text-white shadow-lg">
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
        {/* Mobile Bottom Navigation Bar */}
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


        {/* Left Panel */}
        <div
          className={`absolute md:static w-full md:w-1/3 h-full transition-all duration-500 ease-in-out transform ${selectedChat && isMobile
            ? "-translate-x-full opacity-0"
            : "translate-x-0 opacity-100"
            }`}
        >
          <div className="flex flex-col h-full border-r border-gray-800 bg-[#111]">
            {/* Search Bar */}
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
                              // key={`search-${i}`}
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
                    // key={`friend-${i}`}
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
          className={`absolute md:static w-full md:w-2/3 h-full transition-all duration-500 ease-in-out transform ${selectedChat
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
                {[...messages]
                  .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                  .map((message) => {
                    const isOwnMessage =
                      message.senderId === currentUserId

                    const bubbleStyles = isOwnMessage
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-black";

                    return (
                      <div
                        key={message._id}
                        className={`flex ${isOwnMessage ? "justify-end" : "justify-start"
                          }`}
                      >
                        <div
                          className={`rounded-md p-3 max-w-[70%] break-words relative ${bubbleStyles}`}
                        >
                          <div className="flex items-end gap-2 h-5">
                            <span className="text-base">{message.text}</span>
                            <span className="text-xs text-black opacity-50">
                              {new Date(message.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              })}
                            </span>
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
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="mt-4 flex items-center pb-8 md:pb-0">
                <button type="button" className="p-2 cursor-pointer text-2xl hover:bg-amber-100 rounded-full" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                  😀
                </button>

                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 p-3 bg-[#2a2a2a] border border-gray-700 text-white rounded-l-md h-12 outline-none"
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendMessage();
                    }
                  }}
                  value={message}
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-600 hover:bg-blue-700 p-3 rounded-r-md text-white cursor-pointer"
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
              </div>
              {showEmojiPicker && (
                <div style={{ position: 'absolute', bottom: '80px' }}>
                  <EmojiPicker onEmojiClick={onEmojiClick} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
