import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { usePostContext } from '../context/PostContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddComment from '../components/AddComment'; // Import AddComment component

const FeedList = () => {
  const { posts, setPosts, loading } = usePostContext();
  const [currentUser, setCurrentUser] = useState(null);
  const [newContent, setNewContent] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [updatedContent, setUpdatedContent] = useState('');

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

  const handleLikeToggle = async (postId, userHasLikedPost) => {
    try {
      const token = localStorage.getItem('token');
      const url = `https://social-media-backend-fw8c.onrender.com/api/likes`;
      const method = userHasLikedPost ? 'delete' : 'post';
      await axios({
        method,
        url,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          postId,
        },
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                userHasLikedPost: !userHasLikedPost,
                likesCount: userHasLikedPost ? post.likesCount - 1 : post.likesCount + 1,
              }
            : post
        )
      );
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://social-media-backend-fw8c.onrender.com/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(posts.filter(post => post._id !== postId));
      toast.success('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Error deleting post');
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setUpdatedContent(post.content);
  };

  const handleUpdatePost = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://social-media-backend-fw8c.onrender.com/api/posts/${editingPost._id}`, {
        content: updatedContent,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(posts.map(post => post._id === editingPost._id ? { ...post, content: updatedContent } : post));
      setEditingPost(null);
      setUpdatedContent('');
      toast.success('Post updated successfully');
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Error updating post');
    }
  };

  const handleNewPostSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('https://social-media-backend-fw8c.onrender.com/api/posts', {
        content: newContent,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts([response.data, ...posts]);
      setNewContent('');
      toast.success('Post created successfully');
    } catch (error) {
      console.error('Error creating new post:', error);
      toast.error('Error creating new post');
    }
  };

  const handleCommentAdded = (postId, newComment) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId ? { ...post, comments: [...post.comments, newComment] } : post
      )
    );
  };

  if (loading || !currentUser) {
    return <div>Loading...</div>; // Render a loading state while fetching the current user
  }

  return (
    <div>
      <ToastContainer />
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map((post) => (
          post && post._id && (
            <div key={post._id} className="card mb-3">
              <div className="card-body">
                <h5>{post.author?.email || 'Unknown Author'}</h5>
                {editingPost && editingPost._id === post._id ? (
                  <div>
                    <textarea
                      value={updatedContent}
                      onChange={(e) => setUpdatedContent(e.target.value)}
                    />
                    <button onClick={handleUpdatePost}>Update</button>
                    <button onClick={() => setEditingPost(null)}>Cancel</button>
                  </div>
                ) : (
                  <p>{post.content}</p>
                )}
                <small className="text-muted">{new Date(post.createdAt).toLocaleString()}</small>
                <div className="d-flex justify-content-end align-items-center mt-3">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => handleLikeToggle(post._id, post.userHasLikedPost)}
                  >
                    <FontAwesomeIcon
                      icon={faThumbsUp}
                      style={{ color: post.userHasLikedPost ? 'blue' : 'black', cursor: 'pointer' }}
                    />
                  </button>
                  <span className="ms-2">{post.likesCount} Likes</span>
                  {currentUser && currentUser._id === post.author._id && (
                    <>
                      <button
                        className="btn btn-outline-danger btn-sm ms-3"
                        onClick={() => handleDeletePost(post._id)}
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          style={{ color: 'red', cursor: 'pointer' }}
                        />
                      </button>
                      <button
                        className="btn btn-outline-secondary btn-sm ms-3"
                        onClick={() => handleEditPost(post)}
                      >
                        <FontAwesomeIcon
                          icon={faEdit}
                          style={{ color: 'gray', cursor: 'pointer' }}
                        />
                      </button>
                    </>
                  )}
                </div>
                <AddComment postId={post._id} onCommentAdded={(newComment) => handleCommentAdded(post._id, newComment)} />
                <div>
                  {post.comments.map((comment) => (
                    <div key={comment._id}>
                      <p>{comment.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        ))
      )}
    </div>
  );
};

export default FeedList;