import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";

const AdminDashboard = () => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    fetch('http://localhost:8080/api/emails')
      .then((response) => response.json())
      .then((data) => setEmails(data))
      .catch((error) => console.error('Error fetching emails:', error));
  }, []);
  
  useEffect(() => {
    if (selectedEmail) {
      fetch(`http://localhost:8080/api/messages/${selectedEmail}`)
        .then((response) => response.json())
        .then((data) => setMessages(data))
        .catch((error) => console.error('Error fetching messages:', error));
    }
  }, [selectedEmail]);

  const handleSendMessage = () => {
    if (inputValue.trim() && selectedEmail) {
      const newMessage = {
        email: selectedEmail,
        text: inputValue,
      };

      fetch('http://localhost:8080/api/admin/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMessage),
      })
        .then((response) => response.json())
        .then(() => {
          setMessages((prevMessages) => [...prevMessages, { ...newMessage, from: 'admin', timestamp: new Date().toISOString() }]);
          if (!emails.includes(selectedEmail)) {
            setEmails([...emails, selectedEmail]);
          }
          setInputValue("");
        })
        .catch((error) => console.error('Error saving admin message:', error));
    }
  };

  return (
    <div className="flex h-screen">
      
      <AdminSidebar/>
      <div className="w-1/4 bg-gray-100 border-r border-gray-200 overflow-y-auto">
        <h2 className="text-lg font-bold p-4">Chats</h2>
        <ul>
          {emails.map((email, index) => (
            <li
              key={index}
              className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-200 ${
                email === selectedEmail ? 'bg-gray-200' : ''
              }`}
              onClick={() => setSelectedEmail(email)}
            >
              <p className="font-semibold">{email}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 bg-white p-6">
        <div className="bg-white p-4 rounded-lg shadow-md h-full">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500">
              {selectedEmail ? 'No messages found for this email' : 'Select a chat to view messages'}
            </p>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg mb-2 ${
                  message.from === 'admin' ? 'bg-gray-100' : 'bg-blue-500 text-white'
                }`}
              >
                <p>{message.text}</p>
                <span className="text-xs text-gray-500">
                  {new Date(message.timestamp).toLocaleString()}
                </span>
              </div>
            ))
          )}
          <div className="border-t border-gray-200 p-4 flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              className="ml-2 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
