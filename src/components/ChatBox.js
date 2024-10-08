import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import GlobalChat from './GlobalChat'; // Import the GlobalChat component
import FriendList from '../pages/FriendList'; // Import the FriendList component
import './ChatBox.css'; // Import the CSS file for styling

const socket = io('https://social-media-backend-fw8c.onrender.com'); // Connect to the Socket.IO server

const ChatBox = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [openChats, setOpenChats] = useState([]); // Manage multiple open chats
  const [isFriendListVisible, setIsFriendListVisible] = useState(false); // Manage friend list visibility

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://social-media-backend-fw8c.onrender.com/api/auth/current-user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    // Listen for new messages
    socket.on('receiveMessage', (message) => {
      if (message.recipientEmail === currentUser.email) {
        setOpenChats((prevChats) => {
          const chatExists = prevChats.some(chat => chat.email === message.senderEmail);
          if (!chatExists) {
            return [...prevChats, { email: message.senderEmail, name: message.senderName, minimized: false, hasNewMessage: true }];
          }
          return prevChats.map(chat =>
            chat.email === message.senderEmail ? { ...chat, minimized: false, hasNewMessage: true } : chat
          );
        });
      }
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [currentUser]);

  const handleFriendClick = (friend) => {
    setOpenChats((prevChats) => {
      if (!prevChats.some(chat => chat.email === friend.email)) {
        return [...prevChats, { ...friend, minimized: false, hasNewMessage: false }];
      }
      return prevChats;
    });
  };

  const toggleMinimizeChat = (email) => {
    setOpenChats((prevChats) =>
      prevChats.map(chat =>
        chat.email === email ? { ...chat, minimized: !chat.minimized, hasNewMessage: false } : chat
      )
    );
  };

  const closeChat = (email) => {
    setOpenChats((prevChats) => prevChats.filter(chat => chat.email !== email));
  };

  const toggleFriendListVisibility = () => {
    setIsFriendListVisible(!isFriendListVisible);
  };

  return (
    <div className="chat-box-container">
      <button className="toggle-friend-list-button" onClick={toggleFriendListVisibility}>
        {isFriendListVisible ? 'Hide Friends' : 'Show Friends'}
      </button>
      <div className="friend-list-and-chats">
        {isFriendListVisible && (
          <div className="friend-list-container">
            <FriendList onFriendClick={handleFriendClick} />
          </div>
        )}
        <div className="chat-boxes-container">
          {openChats.map((chat) => (
            <div key={chat.email} className={`chat-container ${chat.minimized ? 'minimized' : ''}`}>
              <div className="chat-header" onClick={() => toggleMinimizeChat(chat.email)}>
                <span>{chat.name} ({chat.email})</span>
                {chat.hasNewMessage && <span className="notification-dot"></span>}
                <button className="close-buttons" onClick={(e) => { e.stopPropagation(); closeChat(chat.email); }}>x</button>
              </div>
              {!chat.minimized && currentUser && (
                <GlobalChat userEmail={currentUser.email} recipientEmail={chat.email} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatBox;