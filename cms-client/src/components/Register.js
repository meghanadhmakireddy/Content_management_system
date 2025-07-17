import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('viewer');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, role })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Registered successfully!');
        setUsername('');
        setPassword('');
        setRole('viewer');
        setTimeout(() => navigate('/login'), 1000);
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Something went wrong.');
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

      <form onSubmit={handleRegister} style={{
        width: '400px',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        backgroundColor: 'grey',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Register</h2>

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

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={inputStyle}
        >
          <option value="viewer">Viewer</option>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit" style={buttonStyle}>Register</button>

        {message && (
          <p style={{
            marginTop: '15px',
            color: message.includes('✅') ? 'green' : 'red',
            textAlign: 'center'
          }}>
            {message}
          </p>
        )}
      </form>
    </div>
    </div>
  );
}

export default Register;
