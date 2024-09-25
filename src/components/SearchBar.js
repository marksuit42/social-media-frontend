import React, { useState } from 'react';
import axios from 'axios';

const SearchBar = () => {
  const [email, setEmail] = useState('');
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`https://social-media-backend-fw8c.onrender.com/api/users/search?email=${email}`);
      if (response.data.length === 0) {
        setMessage('No user found with this email.');
        setResults([]);
      } else {
        setMessage('');
        setResults(response.data);
      }
    } catch (error) {
      console.error('Error searching users:', error);
      setMessage('Error searching users.');
    }
  };

  const handleFollowRequest = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://social-media-backend-fw8c.onrender.com/api/follows/send', { userId }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Follow request sent');
    } catch (error) {
      console.error('Error sending follow request:', error);
    }
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Search by email"
          className="form-control"
        />
        <button type="submit" className="btn btn-primary mt-2">Search</button>
      </form>
      {message && <p className="mt-3">{message}</p>}
      <ul className="list-group mt-3">
        {results.map(user => (
          <li key={user._id} className="list-group-item d-flex justify-content-between align-items-center">
            {user.email}
            <button onClick={() => handleFollowRequest(user._id)} className="btn btn-outline-primary btn-sm">Follow</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;