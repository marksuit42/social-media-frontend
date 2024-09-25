import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FollowRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchFollowRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/follows/requests', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching follow requests:', error);
      }
    };

    fetchFollowRequests();
  }, []);

  const handleAccept = async (followId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/follows/accept/${followId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRequests(requests.filter(request => request._id !== followId));
    } catch (error) {
      console.error('Error accepting follow request:', error);
    }
  };

  const handleDecline = async (followId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/follows/decline/${followId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRequests(requests.filter(request => request._id !== followId));
    } catch (error) {
      console.error('Error declining follow request:', error);
    }
  };

  return (
    <div className="follow-requests">
      <h5>Follow Requests</h5>
      <ul className="list-group">
        {requests.map(request => (
          <li key={request._id} className="list-group-item d-flex justify-content-between align-items-center">
            {request.follower.email}
            <div>
              <button onClick={() => handleAccept(request._id)} className="btn btn-outline-success btn-sm me-2">Accept</button>
              <button onClick={() => handleDecline(request._id)} className="btn btn-outline-danger btn-sm">Decline</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FollowRequests;