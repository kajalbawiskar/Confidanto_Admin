// src/components/ChatWidget.js
import React, { useState, useEffect } from 'react';

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  return (
    <div className={`fixed bottom-4 right-4 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-xs border border-gray-200">
        <div className="flex items-center mb-4">
          <div className="bg-blue-500 text-white rounded-full h-10 w-10 flex items-center justify-center">
            <span className="text-lg font-bold">AM</span>
          </div>
          <h3 className="text-lg font-semibold ml-3 text-gray-700">Account Manager</h3>
        </div>
        <p className="text-gray-600 mb-2">Phone: <span className="text-gray-800 font-medium">+123456789</span></p>
        <p className="text-gray-600 mb-4">Email: <span className="text-gray-800 font-medium">manager@example.com</span></p>
        <button
          className="text-white bg-blue-500 hover:bg-blue-600 rounded-full py-2 px-4 text-sm"
          onClick={() => setIsOpen(false)}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default ChatWidget;
