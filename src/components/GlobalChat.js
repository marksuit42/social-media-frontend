import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import './GlobalChat.css'; // Import the CSS file for styling

const socket = io('https://social-media-backend-fw8c.onrender.com'); // Connect to the Socket.IO server

const GlobalChat = ({ userEmail, recipientEmail }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null); // Reference to the end of the messages container

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://social-media-backend-fw8c.onrender.com/api/messages/${recipientEmail}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessages(response.data);
        scrollToBottom(); // Scroll to bottom after fetching messages
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    // Listen for new messages
    socket.on('receiveMessage', (message) => {
      if (
        (message.senderEmail === userEmail && message.recipientEmail === recipientEmail) ||
        (message.senderEmail === recipientEmail && message.recipientEmail === userEmail)
      ) {
        setMessages((prevMessages) => [...prevMessages, message]);
        scrollToBottom(); // Scroll to bottom when a new message is received
      }
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [recipientEmail, userEmail]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return; // Prevent sending empty messages

    try {
      const token = localStorage.getItem('token');
      const message = {
        recipientEmail,
        content: newMessage,
        senderEmail: userEmail,
      };
      await axios.post(
        'https://social-media-backend-fw8c.onrender.com/api/messages',
        message,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      socket.emit('sendMessage', message);
      setNewMessage(''); // Clear the input field
      scrollToBottom(); // Scroll to bottom after sending a message
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="global-chat">
      <div className="messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.senderEmail === userEmail ? 'sent' : 'received'}`}
          >
            <p className="message-email">{message.senderEmail === userEmail ? 'You' : message.senderEmail}</p>
            <p>{message.content}</p>
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* Reference to the end of the messages container */}
      </div>
      <div className="new-message">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress} // Add event listener for Enter key
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default GlobalChat;