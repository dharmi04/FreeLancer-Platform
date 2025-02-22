// src/pages/Chat.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const Chat = () => {
  const { roomId } = useParams(); 
  // e.g. route: /chat/:roomId => if you have <Route path="/chat/:roomId" element={<Chat />} />

  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Connect to Socket.io server
    const s = io("http://localhost:5000"); // your backend URL
    setSocket(s);

    // Join the specified room
    s.emit("joinRoom", roomId);

    // Listen for chatMessage events
    s.on("chatMessage", (data) => {
      // data might look like { roomId, message, senderId }
      setMessages((prev) => [...prev, data]);
    });

    // Cleanup on unmount
    return () => {
      s.disconnect();
    };
  }, [roomId]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    // For example, pass the current user ID if you have it
    const senderId = "currentUserId"; // or from localStorage
    const data = {
      roomId,
      message: newMessage,
      senderId,
    };

    // Emit to server
    socket.emit("chatMessage", data);
    setNewMessage("");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Chat Room: {roomId}</h2>
      <div className="bg-white p-4 h-64 overflow-y-auto mb-4">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-2">
            <strong>{msg.senderId}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          className="border p-2 flex-1"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSend} className="bg-blue-600 text-white px-4 py-2">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
