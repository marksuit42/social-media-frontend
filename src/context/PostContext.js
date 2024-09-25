import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const PostContext = createContext();

export const usePostContext = () => useContext(PostContext);

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followedUserIds, setFollowedUserIds] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchPostsAndFollows = async () => {
      try {
        const token = localStorage.getItem('token');
        const [postsResponse, followsResponse, currentUserResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/posts', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get('http://localhost:5000/api/follows/following', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get('http://localhost:5000/api/auth/current-user', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const currentUser = currentUserResponse.data;
        setCurrentUser(currentUser);
        const followedUserIds = followsResponse.data.map(follow => follow._id);
        setFollowedUserIds(followedUserIds);

        const filteredPosts = postsResponse.data.filter(post =>
          post.author._id === currentUser._id || followedUserIds.includes(post.author._id)
        );

        setPosts(filteredPosts);
        localStorage.setItem('posts', JSON.stringify(filteredPosts));
        localStorage.setItem('postsTimestamp', Date.now());
      } catch (error) {
        console.error('Error fetching posts and follows:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostsAndFollows();
  }, []);

  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem('posts', JSON.stringify(posts));
      localStorage.setItem('postsTimestamp', Date.now());
    }
  }, [posts]);

  useEffect(() => {
    const updatePosts = async () => {
      try {
        const token = localStorage.getItem('token');
        const postsResponse = await axios.get('http://localhost:5000/api/posts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const filteredPosts = postsResponse.data.filter(post =>
          post.author._id === currentUser._id || followedUserIds.includes(post.author._id)
        );

        setPosts(filteredPosts);
        localStorage.setItem('posts', JSON.stringify(filteredPosts));
        localStorage.setItem('postsTimestamp', Date.now());
      } catch (error) {
        console.error('Error updating posts:', error);
      }
    };

    if (currentUser) {
      updatePosts();
    }
  }, [followedUserIds, currentUser]);

  const addPost = (post) => {
    setPosts((prevPosts) => [post, ...prevPosts]);
  };

  const addCommentToPost = (postId, comment) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId ? { ...post, comments: [...post.comments, comment] } : post
      )
    );
  };

  return (
    <PostContext.Provider value={{ posts, setPosts, addPost, addCommentToPost, loading }}>
      {children}
    </PostContext.Provider>
  );
};