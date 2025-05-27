import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CreatePost.css'; 

const CreatePost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [refLinks, setRefLinks] = useState(['']);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const addRefLink = () => {
    setRefLinks([...refLinks, '']);
  };

  const removeRefLink = (index) => {
    setRefLinks(refLinks.filter((_, i) => i !== index));
  };

  const handleRefLinkChange = (index, value) => {
    const updatedLinks = [...refLinks];
    updatedLinks[index] = value;
    setRefLinks(updatedLinks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Retrieve user object from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.token) {
      setError('Please log in to create a post');
      navigate('/login');
      return;
    }

    const token = user.token;

    // Validate token expiry
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;
      if (Date.now() >= expiry) {
        setError('Your session has expired. Please log in again.');
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }
    } catch (err) {
      setError('Invalid token. Please log in again.');
      localStorage.removeItem('user');
      navigate('/login');
      return;
    }

    const filteredRefLinks = refLinks.filter(link => link.trim() !== '');
    const postData = {
      title,
      description,
      refLinks: filteredRefLinks,
    };

    try {
      console.log('Sending token:', token); // Debug token
      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Post created successfully!');
        setTitle('');
        setDescription('');
        setRefLinks(['']);
        navigate('/postList'); // Redirect to PostList page
      } else {
        setError(data.message || 'Failed to create post');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
      console.error('Create post error:', err);
    }
  };

  return (
    <div className="create-post-container">
      <h2>Create a New Post</h2>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="create-post-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter post title"
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Enter post description"
            rows="5"
          />
        </div>
        <div className="form-group">
          <label>Reference Links</label>
          {refLinks.map((link, index) => (
            <div key={index} className="ref-link-group">
              <input
                type="url"
                value={link}
                onChange={(e) => handleRefLinkChange(index, e.target.value)}
                placeholder="Enter reference link"
              />
              {refLinks.length > 1 && (
                <button
                  type="button"
                  className="remove-link-btn"
                  onClick={() => removeRefLink(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" className="add-link-btn" onClick={addRefLink}>
            Add Link
          </button>
        </div>
        <button type="submit" className="submit-btn">
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;