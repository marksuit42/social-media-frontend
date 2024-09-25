import React from 'react';
import PostForm from '../components/PostForm';
import FeedList from '../FeedList/FeedList';

const Feed = () => {
  return (
    <div className="container mt-4">
      <PostForm />
      <FeedList />
    </div>
  );
};

export default Feed;
