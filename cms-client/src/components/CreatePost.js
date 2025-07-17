import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function CreatePost({ user }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // 📝 Check if editing
  const editingPost = location.state?.postToEdit || null;

  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setContent(editingPost.content);
    }
  }, [editingPost]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) formData.append('image', image);

    const endpoint = editingPost
      ? `http://localhost:5000/api/posts/${editingPost._id}`
      : 'http://localhost:5000/api/posts';

    const method = editingPost ? 'PUT' : 'POST';

    const res = await fetch(endpoint, {
      method,
      credentials: 'include',
      body: formData
    });

    const data = await res.json();
    if (res.ok) {
      setMsg(editingPost ? '✅ Post updated' : '✅ Post created');
      setTimeout(() => navigate('/'), 1000);
    } else {
      setMsg(`❌ ${data.message}`);
    }
  };

  // 🔐 Access restriction
  if (!user || (user.role !== 'editor' && user.role !== 'admin')) {
    return (
      <div style={{ padding: '30px', textAlign: 'center' }}>
        <h2 style={{ color: 'red' }}>🚫 Access Denied</h2>
        <p>You must be logged in as an Editor or Admin to create or edit posts.</p>
      </div>
    );
  }

  return (
    <div style={{
      padding: '30px',
      minHeight: '100vh',
      backgroundColor: '#FDA481',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        backgroundColor: '#A34054',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: 'white' }}>
          {editingPost ? '| Edit Post |' : '| Create a New Post |'}
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Post Title"
            required
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '15px',
              fontSize: '16px',
              borderRadius: '6px',
              border: '1px solid #C48CB3',
              outline: 'none',
              backgroundColor: '#181A2F',
              color: 'white'
            }}
          />

          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Post Content..."
            required
            style={{
              width: '100%',
              padding: '10px',
              height: '120px',
              marginBottom: '15px',
              fontSize: '16px',
              borderRadius: '6px',
              border: '1px solid #C48CB3',
              outline: 'none',
              backgroundColor: '#181A2F',
              color: 'white'
            }}
          />

          {/* ✅ Show media preview if editingPost exists */}
          {editingPost && (editingPost.mediaUrl || editingPost.imageUrl) && (
            (editingPost.mediaUrl || editingPost.imageUrl).match(/\.(mp4|webm)$/i) ? (
              <video
                controls
                style={{
                  width: '100%',
                  marginBottom: '15px',
                  borderRadius: '8px'
                }}
              >
                <source
                  src={`http://localhost:5000/uploads/${editingPost.mediaUrl || editingPost.imageUrl}`}
                  type="video/mp4"
                />
              </video>
            ) : (
              <img
                src={`http://localhost:5000/uploads/${editingPost.mediaUrl || editingPost.imageUrl}`}
                alt="Preview"
                style={{
                  width: '100%',
                  marginBottom: '15px',
                  borderRadius: '8px'
                }}
              />
            )
          )}

          <input
            type="file"
            accept="image/*,video/*"
            onChange={e => setImage(e.target.files[0])}
            style={{
              marginBottom: '15px',
              padding: '10px',
              backgroundColor: '#f0f0f0',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          />

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#83A6CE',
              color: 'white',
              fontSize: '16px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            {editingPost ? 'Update Post' : 'Create Post'}
          </button>
        </form>


        {msg && (
          <p style={{
            marginTop: '20px',
            color: msg.startsWith('✅') ? 'green' : 'red',
            textAlign: 'center'
          }}>
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}

export default CreatePost;
