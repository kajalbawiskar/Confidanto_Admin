import React, { useState, useEffect } from "react";
import { FaComments } from "react-icons/fa";
import {
  MdVideoCall,
  MdAttachFile,
  MdImage,
  MdInsertDriveFile,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";

const ChatBox = ({ isOpen, toggleChat }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically open the chat widget for new users
    if (!isOpen) {
      toggleChat();
    }

    // Send an introduction message from the account manager
    const welcomeMessage = {
      from: "manager",
      text: "Hello! I'm John, your account manager. You can reach me at john@example.com or call me at +1234567890. How can I assist you today?",
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage = {
        from: "user",
        text: inputValue,
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setInputValue("");
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const toggleAttachmentOptions = () => {
    setShowAttachmentOptions(!showAttachmentOptions);
  };

  const handleVideoCallClick = () => {
    toggleAttachmentOptions();
    navigate("/videocall");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);

      const newMessage = {
        from: "user",
        text: `Sent an attachment: ${file.name}`,
        fileUrl: URL.createObjectURL(file),
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
    }
    setShowAttachmentOptions(false);
  };

  return isOpen ? (
    <div className="fixed bottom-20 right-4 w-80 bg-white shadow-xl rounded-lg overflow-hidden">
      <div className="bg-blue-600 p-4 text-white flex items-center justify-between">
        <h3 className="text-lg font-semibold">Chat with us</h3>
        <button onClick={toggleChat} className="text-white focus:outline-none">
          &times;
        </button>
      </div>
      <div className="p-4 max-h-fit overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-3 ${
              message.from === "manager" ? "text-left" : "text-right"
            }`}
          >
            <p
              className={`inline-block p-2 rounded-lg text-sm ${
                message.from === "manager"
                  ? "bg-gray-100 text-gray-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {message.text}
            </p>
            {message.fileUrl && (
              <a
                href={message.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {message.fileUrl.match(/\.(jpeg|jpg|gif|png)$/) ? (
                  <img
                    src={message.fileUrl}
                    alt={message.text}
                    className="max-w-full h-auto mt-2"
                  />
                ) : (
                  <span className="text-blue-600 underline">
                    {message.text}
                  </span>
                )}
              </a>
            )}
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-200 flex items-center space-x-2 relative">
        <button
          className="p-2 text-blue-600 hover:text-blue-800 focus:outline-none"
          onClick={toggleAttachmentOptions}
        >
          <MdAttachFile className="w-6 h-6" />
        </button>
        {showAttachmentOptions && (
          <div className="absolute bottom-12 left-0 bg-white shadow-lg rounded-lg p-2 flex space-x-2">
            <button
              className="p-2 text-blue-600 hover:text-blue-800 focus:outline-none"
              onClick={handleVideoCallClick}
            >
              <MdVideoCall className="w-6 h-6" title="Start Video Call" />
            </button>
            <label className="p-2 text-blue-600 hover:text-blue-800 focus:outline-none cursor-pointer">
              <MdImage className="w-6 h-6" title="Attach Image/Video" />
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <label className="p-2 text-blue-600 hover:text-blue-800 focus:outline-none cursor-pointer">
              <MdInsertDriveFile className="w-6 h-6" title="Attach File" />
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        )}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          aria-label="Type your message"
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>
    </div>
  ) : null;
};

export default ChatBox;
