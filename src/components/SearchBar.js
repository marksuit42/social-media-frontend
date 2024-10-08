import React, { useState } from 'react';
import axios from 'axios';
import './SearchBar.css'; // Import the CSS file for styling

const SearchBar = () => {
  const [email, setEmail] = useState('');
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage(''); // Clear any previous messages
      setResults([]); // Clear results
      setIsModalOpen(false); // Close modal
      return;
    }
    try {
      const response = await axios.get(`https://social-media-backend-fw8c.onrender.com/api/users/search?email=${email}`);
      if (response.data.length === 0) {
        setMessage('No user found with this email.');
        setResults([]);
        setIsModalOpen(false);
      } else {
        setMessage('');
        setResults(response.data);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Error searching users:', error);
      setMessage('Error searching users.');
      setResults([]);
      setIsModalOpen(false);
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
      setMessage('Follow request sent.');
    } catch (error) {
      console.error('Error sending follow request:', error);
      setMessage('Error sending follow request.');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Search by email"
        />
        <button type="submit">Search</button>
      </form>
      {message && <p>{message}</p>}
      {isModalOpen && (
        <div className="modal">
          <button className="close-button" onClick={closeModal}>X</button>
          <div className="modal-content">
            <div className="search-results">
              {results.map((result) => (
                <div key={result._id} className="search-result-item">
                  <p>{result.email}</p> {/* Make sure result.email exists */}
                  <button onClick={() => handleFollowRequest(result._id)}>Follow</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;