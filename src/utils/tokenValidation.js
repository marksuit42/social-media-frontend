// utils/tokenValidation.js
import axios from 'axios';

export const validateToken = async () => {
  const token = localStorage.getItem('token'); // Get token from localStorage

  if (!token) {
    return { valid: false };
  }

  try {
    const response = await axios.get('https://social-media-backend-fw8c.onrender.com/api/auth/validate-token', {
      headers: {
        Authorization: `Bearer ${token}`  // Send the token in the Authorization header
      }
    });

    return { valid: response.data.valid, user: response.data.user };
  } catch (error) {
    console.error('Token validation failed:', error);
    return { valid: false };
  }
};
