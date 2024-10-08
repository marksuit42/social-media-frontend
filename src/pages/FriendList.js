import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FriendList.css'; // Import the CSS file for styling

const FriendList = ({ onFriendClick }) => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://social-media-backend-fw8c.onrender.com/api/follows/following', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFriends(response.data);
      } catch (error) {
        console.error('Error fetching friends list:', error);
      }
    };

    fetchFriends();
  }, []);

  return (
    <div className="friend-list">
      <ul>
        {friends.map((friend) => (
          <li key={friend._id} onClick={() => onFriendClick(friend)}>
            {friend.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendList;