import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login({ setting }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

  
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (res.ok) {
        setting(data.user);
        navigate('/');
      } else {
        setMessage(`❌ ${data.message}`);
      }
    
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '5px',
    border: '1px solid #ccc'
  };

  const buttonStyle = {
  width: '100%',
  padding: '10px',
  backgroundColor: '#FDA481', // Peach
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};


  return (
    <div style={{ backgroundColor: '#f2f2f2', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
      width: '400px',
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      backgroundColor: '#ffffff',
      borderTop: '8px solid #54162B', // Wine
      fontFamily: 'Arial, sans-serif'
    }}>

        <form onSubmit={handleLogin} style={{
          width: '400px',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          backgroundColor: 'grey',
          fontFamily: 'Arial, sans-serif'
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />

          <button type="submit" style={buttonStyle}>Login</button>

          {message && (
            <p style={{
              marginTop: '15px',
              color: message.includes('✅') ? 'green' : 'red',
              textAlign: 'center'
            }}>
              {message}
            </p>
          )}

          <p style={{ marginTop: '15px', textAlign: 'center' }}>
            Don’t have an account? <Link to="/register" style={{ color: '#fff', textDecoration: 'underline' }}>Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
