import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";

const AdminDashboard = ({ loggedInUser }) => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [unreadMessages, setUnreadMessages] = useState({});
  const [messageStatus, setMessageStatus] = useState(null);

  // Fetch emails initially and on a set interval
  useEffect(() => {
    const fetchEmails = () => {
      fetch('https://api.confidanto.com/chatbox-api/api/emails')
        .then((response) => response.json())
        .then((data) => {
          setEmails(data);
          const unread = {};
          data.forEach(email => {
            if (!unreadMessages[email]) unread[email] = true;
          });
          setUnreadMessages(prev => ({ ...prev, ...unread }));
        })
        .catch((error) => console.error('Error fetching emails:', error));
    };

    fetchEmails();
    const emailInterval = setInterval(fetchEmails, 5000); // Poll every 5 seconds

    return () => clearInterval(emailInterval);
  }, [unreadMessages]);

  // Fetch messages for the selected email
  useEffect(() => {
    if (selectedEmail) {
      const fetchMessages = () => {
        fetch(`https://api.confidanto.com/chatbox-api/api/messages/${selectedEmail}`)
          .then((response) => response.json())
          .then((data) => {
            setMessages(data);
            setUnreadMessages(prev => ({ ...prev, [selectedEmail]: false }));
          })
          .catch((error) => console.error('Error fetching messages:', error));
      };

      fetchMessages();
      const messageInterval = setInterval(fetchMessages, 5000); // Poll every 5 seconds

      return () => clearInterval(messageInterval);
    }
  }, [selectedEmail]);

  const handleSendMessage = () => {
    if (inputValue.trim() && selectedEmail) {
      const newMessage = {
        email: selectedEmail,
        text: inputValue,
      };

      fetch('https://api.confidanto.com/chatbox-api/api/admin/messages', {
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
            setUnreadMessages(prev => ({ ...prev, [selectedEmail]: true }));
          }
          setInputValue("");
          setMessageStatus('Message sent successfully!');
          setTimeout(() => setMessageStatus(null), 3000);
        })
        .catch((error) => {
          console.error('Error saving admin message:', error);
          setMessageStatus('Failed to send message.');
          setTimeout(() => setMessageStatus(null), 3000);
        });
    }
  };

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="w-1/4 bg-gray-100 border-r border-gray-200">
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
              <p
                className={`font-semibold ${
                  unreadMessages[email] ? 'text-red-600' : 'text-black'
                }`}
              >
                {email}
              </p>
              {unreadMessages[email] && (
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full float-right"></span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 bg-white p-6">
        <div className="bg-white p-4 rounded-lg shadow-md h-full overflow-y-auto">
          {messageStatus && (
            <div
              className={`p-2 mb-4 text-white rounded-md ${
                messageStatus.includes('success') ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              {messageStatus}
            </div>
          )}

          {messages.length === 0 ? (
            <p className="text-center text-gray-500">
              {selectedEmail ? 'No messages found for this email' : 'Select a chat to view messages'}
            </p>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg mb-2 ${
                  message.from === 'admin'
                    ? 'bg-gray-300 text-gray-800'
                    : 'bg-blue-100 text-blue-800'
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
              className="ml-2 bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 focus:outline-none"
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
