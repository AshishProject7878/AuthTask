import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/EditPost.css';

const EditPost = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get post ID from URL
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [refLinks, setRefLinks] = useState(['']);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.token) {
        setError('Please log in to edit a post');
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

        const response = await axios.get(`http://localhost:5000/api/posts/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        const post = response.data;
        setTitle(post.title);
        setDescription(post.description);
        setRefLinks(post.refLinks.length > 0 ? post.refLinks : ['']);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch post');
        setLoading(false);
        console.error('Fetch post error:', err);
      }
    };

    fetchPost();
  }, [id, navigate]);

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

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.token) {
      setError('Please log in to edit a post');
      navigate('/login');
      return;
    }

    const token = user.token;

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
      const response = await axios.put(`http://localhost:5000/api/posts/${id}`, postData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (response.status === 200) {
        setMessage('Post updated successfully!');
        navigate('/postList', { state: { message: 'Post updated successfully!' } });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post');
      console.error('Update post error:', err);
    }
  };

  if (loading) {
    return <div className="edit-post-container">Loading...</div>;
  }

  return (
    <div className="edit-post-container">
      <h2>Edit Post</h2>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="edit-post-form">
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
          Update Post
        </button>
      </form>
    </div>
  );
};

export default EditPost;