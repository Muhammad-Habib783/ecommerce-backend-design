import React, { useState } from 'react';

function Messages({ setPage }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Support Team',
      text: 'Hello! Welcome to our store. How can we help you today?',
      time: '10:00 AM',
      isSupport: true
    }
  ]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <div className="text-6xl mb-4">💬</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Not Logged In</h2>
          <p className="text-gray-500 mb-6">Please sign in to view messages</p>
          <button
            onClick={() => setPage('auth')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 mr-3"
          >
            Sign In
          </button>
          <button
            onClick={() => setPage('home')}
            className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const sendMessage = () => {
    if (!message.trim()) return;
    const newMessage = {
      id: messages.length + 1,
      sender: user.name || user.email,
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSupport: false
    };
    setMessages([...messages, newMessage]);
    setMessage('');

    // Auto reply
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        sender: 'Support Team',
        text: 'Thank you for your message! Our team will get back to you within 24 hours.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSupport: true
      }]);
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
        <button onClick={() => setPage('home')} className="text-blue-600 hover:underline text-sm">
          ← Back to Home
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Chat header */}
        <div className="bg-blue-600 text-white p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold">
            S
          </div>
          <div>
            <p className="font-medium">Support Team</p>
            <p className="text-xs text-blue-200">Online</p>
          </div>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isSupport ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.isSupport
                    ? 'bg-white text-gray-800 shadow'
                    : 'bg-blue-600 text-white'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.isSupport ? 'text-gray-400' : 'text-blue-200'}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t flex gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Messages;