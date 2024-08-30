// src/components/ChatInterface.js
import React, { useState } from 'react';

function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  const sendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { text: message, sender: 'user' }]);
      setMessage('');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setMessages([...messages, { file, sender: 'user' }]);
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-lg mt-4">
      <div className="h-64 overflow-y-scroll mb-4 bg-white p-4 rounded-lg shadow-inner">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-4 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
            {msg.text && (
              <p className="inline-block bg-blue-100 text-blue-800 p-3 rounded-lg max-w-xs">
                {msg.text}
              </p>
            )}
            {msg.file && (
              <img
                src={URL.createObjectURL(msg.file)}
                alt="attachment"
                className="max-w-xs mt-2 rounded-lg shadow-sm"
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="border p-3 rounded-lg w-full text-gray-800 bg-white shadow-sm"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white py-2 px-4 rounded-full ml-2 shadow-md hover:bg-blue-600"
        >
          Send
        </button>
        <input type="file" onChange={handleFileUpload} className="hidden" id="fileInput" />
        <label htmlFor="fileInput" className="bg-gray-200 py-2 px-4 rounded-full ml-2 cursor-pointer shadow-md hover:bg-gray-300">
          Attach Image
        </label>
      </div>
    </div>
  );
}

export default ChatInterface;
