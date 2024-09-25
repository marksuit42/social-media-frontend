import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

const AddComment = ({ postId, onCommentAdded, postAuthorId }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [editContent, setEditContent] = useState('');
  const [editCommentId, setEditCommentId] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/auth/current-user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    const fetchComments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/posts/${postId}/comments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchCurrentUser();
    fetchComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (!currentUser) {
      setError('User not authenticated');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const author = currentUser._id;
      const response = await axios.post(
        `http://localhost:5000/api/posts/${postId}/comments`,
        { content, author },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onCommentAdded(response.data);
      setComments([...comments, response.data]);
      setContent('');
      toast.success('Comment added successfully!');
    } catch (error) {
      setError('Error adding comment');
      toast.error('Failed to add comment.');
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/comments/${commentId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments(comments.map(comment => comment._id === commentId ? response.data : comment));
      toast.success('Comment liked successfully!');
    } catch (error) {
      toast.error('Failed to like comment.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComments(comments.filter(comment => comment._id !== commentId));
      toast.success('Comment deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete comment.');
    }
  };

  const handleUpdateComment = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/comments/${editCommentId}`,
        { content: editContent },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments(comments.map(comment => comment._id === editCommentId ? response.data : comment));
      setEditCommentId(null);
      setEditContent('');
      toast.success('Comment updated successfully!');
    } catch (error) {
      toast.error('Failed to update comment.');
    }
  };

  const startEditing = (comment) => {
    setEditCommentId(comment._id);
    setEditContent(comment.content);
  };

  const cancelEditing = () => {
    setEditCommentId(null);
    setEditContent('');
  };

  if (!currentUser) {
    return <div>Loading...</div>; // Render a loading state while fetching the current user
  }

  return (
    <div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a comment"
        rows="2"
        className="form-control"
      />
      <button onClick={handleAddComment} className="btn btn-secondary mt-2">Add Comment</button>
      {error && <p className="text-danger">{error}</p>}
      <div className="mt-3">
        {comments.map((comment) => (
          <div key={comment._id} className="card mb-2">
            <div className="card-body">
              {editCommentId === comment._id ? (
                <>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows="2"
                    className="form-control"
                  />
                  <button onClick={handleUpdateComment} className="btn btn-primary mt-2">Update</button>
                  <button onClick={cancelEditing} className="btn btn-secondary mt-2">Cancel</button>
                </>
              ) : (
                <>
                  <p>{comment.content}</p>
                  <small className="text-muted">{new Date(comment.createdAt).toLocaleString()}</small>
                  <button onClick={() => handleLikeComment(comment._id)} className="btn btn-link">
                    <FontAwesomeIcon icon={faThumbsUp} /> {comment.likeCount}
                  </button>
                  {(comment.author === currentUser._id || postAuthorId === currentUser._id) && (
                    <>
                      <button onClick={() => startEditing(comment)} className="btn btn-link">
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button onClick={() => handleDeleteComment(comment._id)} className="btn btn-link">
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddComment;