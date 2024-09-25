import React, { useState } from 'react';
import { usePostContext } from '../context/PostContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const fetchPost = async (content, token) => {
  const response = await axios.post(
    'https://social-media-backend-fw8c.onrender.com/api/posts',
    { content },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    }
  );

  const post = response.data.post;
  localStorage.setItem('postCache', JSON.stringify(post));
  localStorage.setItem('postCacheTimestamp', Date.now().toString());
  return post;
};

const PostForm = () => {
  const [content, setContent] = useState('');
  const { addPost } = usePostContext(); // Get addPost function from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const post = await fetchPost(content, token);
      addPost(post);
      setContent('');
      toast.success('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="form-group">
        <textarea
          className="form-control"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          rows="3"
        />
      </div>
      <button type="submit" className="btn btn-primary mt-2">Post</button>
    </form>
  );
};

export default PostForm;