import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FriendList = () => {
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://social-media-backend-fw8c.onrender.com/api/follows/following', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Following data:', response.data); // Log the result for debugging
        setFollowing(response.data);
      } catch (error) {
        console.error('Error fetching following list:', error);
      }
    };

    fetchFollowing();
  }, []);

  return (
    <div className="friend-list">
      <h2>Following</h2>
      <ul className="list-group">
        {following.map(user => (
          <li key={user._id} className="list-group-item">
            {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendList;