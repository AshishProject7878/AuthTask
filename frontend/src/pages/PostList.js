import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/PostList.css'; 

const PostList = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      setMessage('');
      setError('');

      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.token) {
        setError('Please log in to view your posts');
        navigate('/login');
        return;
      }

      try {
        const payload = JSON.parse(atob(user.token.split('.')[1]));
        const expiry = payload.exp * 1000;
        if (Date.now() >= expiry) {
          setError('Your session has expired. Please log in again.');
          localStorage.removeItem('user');
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/posts', {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        // Filter posts by userId
        const userPosts = response.data.filter(
          post => post.userId === user._id
        );
        setPosts(userPosts);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch posts');
        console.error('Fetch posts error:', err);
      }
    };

    fetchPosts();
  }, [navigate]);

  const handleDelete = async (postId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.token) {
      setError('Please log in to delete a post');
      navigate('/login');
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setPosts(posts.filter(post => post._id !== postId));
      setMessage('Post deleted successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete post');
      console.error('Delete post error:', err);
    }
  };

  const handleEdit = (postId) => {
    navigate(`/edit-post/${postId}`);
  };

  return (
    <div className="post-list-container">
      <h2>Your Posts</h2>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      {posts.length === 0 && !error && (
        <p className="no-posts">No posts found. Create one!</p>
      )}
      <div className="posts-grid">
        {posts.map(post => (
          <div key={post._id} className="post-card">
            <h3>{post.title}</h3>
            <p className="post-description">{post.description}</p>
            {post.refLinks.length > 0 && (
              <div className="ref-links">
                <p><strong>Reference Links:</strong></p>
                <ul>
                  {post.refLinks.map((link, index) => (
                    <li key={index}>
                      <a href={link} target="_blank" rel="noopener noreferrer">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="post-meta">
              Created on: {new Date(post.createdAt).toLocaleDateString()}
            </p>
            <div className="post-actions">
              <button
                className="edit-btn"
                onClick={() => handleEdit(post._id)}
              >
                <i className="fa fa-edit"></i> Edit
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDelete(post._id)}
              >
                <i className="fa fa-trash"></i> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        className="create-post-btn"
        onClick={() => navigate('/createPost')}
      >
        Create New Post
      </button>
    </div>
  );
};

export default PostList;