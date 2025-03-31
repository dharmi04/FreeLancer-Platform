import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import io from "socket.io-client";
import axios from "axios";
import { 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical, 
  ArrowLeft, 
  CheckCheck,
  Calendar,
  DollarSign,
  User,
  FileText
} from "lucide-react";
import EmojiPicker from 'emoji-picker-react';

const socket = io("http://localhost:5000");

const DiscussionThread = () => {
  const { projectId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch project details
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setProject(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching project details:", error);
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  const goBack = () => {
    // Navigate to the correct dashboard based on the user role
    if (user.role === 'client') {
      navigate('/client/dashboard');  // Redirect to client dashboard
    } else if (user.role === 'freelancer') {
      navigate('/freelancer/dashboard');  // Redirect to freelancer dashboard
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!user) return;

    // Join the project room
    socket.emit("joinProject", projectId);

    // Fetch existing messages
    axios
      .get(`http://localhost:5000/api/projects/${projectId}/discussions`)
      .then((res) => setMessages(res.data.discussions))
      .catch((err) => console.error("Error fetching messages:", err));

    // Listen for new messages
    socket.on("messageReceived", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("messageReceived");
      socket.emit("leaveProject", projectId);
    };
  }, [projectId, user]);

  const sendMessage = async () => {
    // Trim the message and check if it's empty
    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage) return;

    const messageData = {
      sender: user._id,
      text: trimmedMessage,
      timestamp: new Date().toISOString()
    };

    try {
      const res = await axios.post(
        `http://localhost:5000/api/projects/${projectId}/discussions`,
        messageData
      );

      // UI updates after confirmation from backend
      setMessages((prev) => [...prev, res.data.newMessage]);

      // Emit event via WebSocket
      socket.emit("messageSent", res.data.newMessage);
      
      // Clear the input field
      setNewMessage("");
      setShowEmojiPicker(false);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setNewMessage((prev) => prev + emojiObject.emoji);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Project Details Sidebar */}
      <div className="w-1/4 bg-white border-r overflow-y-auto">
        <div className="p-4 flex items-center justify-between border-b">
          <div className="flex items-center space-x-3">
            
          <ArrowLeft className="text-gray-600" onClick={goBack} />  {/* Call goBack on click */}
           
            {project?.imageUrl && (
              <img 
                src={`http://localhost:5000/${project.imageUrl}`} 
                alt="Project" 
                className="w-12 h-12 rounded-lg object-cover"
              />
            )}
            <div>
              <h2 className="font-semibold text-lg">{project?.title}</h2>
              <p className="text-xs text-gray-500">Project Details</p>
            </div>
          </div>
          <MoreVertical className="text-gray-600" />
        </div>

        {/* Project Details */}
        <div className="p-4 space-y-4">
          <div className="flex items-center space-x-3">
            <FileText className="text-blue-500" />
            <div>
              <p className="text-sm font-medium">Description</p>
              <p className="text-xs text-gray-600">{project?.description}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <DollarSign className="text-green-500" />
            <div>
              <p className="text-sm font-medium">Budget</p>
              <p className="text-xs text-gray-600">${project?.budget}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Calendar className="text-purple-500" />
            <div>
              <p className="text-sm font-medium">Deadline</p>
              <p className="text-xs text-gray-600">
                {project?.deadline 
                  ? new Date(project.deadline).toLocaleDateString() 
                  : 'Not specified'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <User className="text-red-500" />
            <div>
              <p className="text-sm font-medium">Client</p>
              <p className="text-xs text-gray-600">{project?.client?.name || 'Unknown'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F0F2F5]">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex flex-col ${
                msg.sender._id === user._id ? 'items-end' : 'items-start'
              }`}
            >
              {/* Sender Name */}
              <span className="text-xs text-gray-500 mb-1">
                {msg.sender._id !== user._id ? msg.sender.name.toLowerCase() : ''}
              </span>
              <div 
                className={`max-w-md p-3 rounded-xl ${
                  msg.sender._id === user._id 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-800 shadow-sm'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <div className="flex items-center justify-end space-x-1 mt-1">
                  <span className="text-xs opacity-70">
                    {formatTimestamp(msg.timestamp)}
                  </span>
                  {msg.sender._id === user._id && (
                    <CheckCheck 
                      className="w-4 h-4 text-blue-200" 
                      strokeWidth={3} 
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Area */}
        <div className="bg-white p-4 border-t flex items-center space-x-3">
          <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
            <Smile className="text-gray-600" />
          </button>
          <button>
            <Paperclip className="text-gray-600" />
          </button>
          
          {showEmojiPicker && (
            <div className="absolute bottom-20 left-0">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}

          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-gray-100 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <button 
            onClick={sendMessage}
            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscussionThread;



// import React, { useState, useEffect, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
// import { ArrowLeft } from "lucide-react";
// import axios from "axios";
// import io from "socket.io-client";
// import EmojiPicker from 'emoji-picker-react';

// const socket = io("http://localhost:5000");

// const DiscussionThread = () => {
//   const { projectId } = useParams();
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [project, setProject] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const messagesEndRef = useRef(null);
//   const user = JSON.parse(localStorage.getItem("user"));
//   const navigate = useNavigate(); // Initialize useNavigate

//   // Fetch project details
//   useEffect(() => {
//     const fetchProjectDetails = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/api/projects/${projectId}`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         });
//         setProject(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching project details:", error);
//         setLoading(false);
//       }
//     };

//     fetchProjectDetails();
//   }, [projectId]);

//   const goBack = () => {
//     // Navigate to the correct dashboard based on the user role
//     if (user.role === 'client') {
//       navigate('/client/dashboard');  // Redirect to client dashboard
//     } else if (user.role === 'freelancer') {
//       navigate('/freelancer/dashboard');  // Redirect to freelancer dashboard
//     }
//   };

//   // Format timestamp
//   const formatTimestamp = (timestamp) => {
//     const date = new Date(timestamp);
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   // Scroll to bottom of messages
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   useEffect(() => {
//     if (!user) return;

//     // Join the project room
//     socket.emit("joinProject", projectId);

//     // Fetch existing messages
//     axios
//       .get(`http://localhost:5000/api/projects/${projectId}/discussions`)
//       .then((res) => setMessages(res.data.discussions))
//       .catch((err) => console.error("Error fetching messages:", err));

//     // Listen for new messages
//     socket.on("messageReceived", (message) => {
//       setMessages((prevMessages) => [...prevMessages, message]);
//     });

//     return () => {
//       socket.off("messageReceived");
//       socket.emit("leaveProject", projectId);
//     };
//   }, [projectId, user]);

//   const sendMessage = async () => {
//     const trimmedMessage = newMessage.trim();
//     if (!trimmedMessage) return;

//     const messageData = {
//       sender: user._id,
//       text: trimmedMessage,
//       timestamp: new Date().toISOString()
//     };

//     try {
//       const res = await axios.post(
//         `http://localhost:5000/api/projects/${projectId}/discussions`,
//         messageData
//       );
//       setMessages((prev) => [...prev, res.data.newMessage]);
//       socket.emit("messageSent", res.data.newMessage);
//       setNewMessage("");
//       setShowEmojiPicker(false);
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   const handleEmojiClick = (emojiObject) => {
//     setNewMessage((prev) => prev + emojiObject.emoji);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen bg-gray-100">
//       <div className="w-1/4 bg-white border-r overflow-y-auto">
//         <div className="p-4 flex items-center justify-between border-b">
//           <div className="flex items-center space-x-3">
//             <ArrowLeft className="text-gray-600" onClick={goBack} /> {/* Call goBack on click */}
//             {project?.imageUrl && (
//               <img 
//                 src={`http://localhost:5000/${project.imageUrl}`} 
//                 alt="Project" 
//                 className="w-12 h-12 rounded-lg object-cover"
//               />
//             )}
//             <div>
//               <h2 className="font-semibold text-lg">{project?.title}</h2>
//               <p className="text-xs text-gray-500">Project Details</p>
//             </div>
//           </div>
//         </div>
//         {/* Other content for project details... */}
//       </div>

//       <div className="flex-1 flex flex-col">
//         {/* Messages Container */}
//         <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F0F2F5]">
//           {/* Render Messages */}
//         </div>

//         {/* Message Input Area */}
//         <div className="bg-white p-4 border-t flex items-center space-x-3">
//           <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
//             😊 {/* Emoji Button */}
//           </button>
//           <input
//             type="text"
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
//             placeholder="Type a message..."
//             className="flex-1 bg-gray-100 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded-full">
//             Send {/* Send Button */}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DiscussionThread;
