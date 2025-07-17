import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  const navStyle = {
    backgroundColor: '#1f1f1f',
    color: 'white',
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontFamily: 'Arial, sans-serif'
  };

  return (
    <nav style={{
  backgroundColor: '#181A2F',  // Midnight Navy
  padding: '10px 20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  color: 'white',
  fontFamily: 'Arial, sans-serif'
}}>
  <div style={{ display: 'flex', gap: '15px', paddingLeft:'5px' }}>
    <Link to="/" style={{ color: '#FDA481', textDecoration: 'none', fontFamily: 'sans' }}>Home</Link>
   {user ? (
        <>
          {(user.role === 'editor' || user.role === 'admin') && (
            <Link to="/create" style={{ color: '#FDA481', textDecoration: 'none', fontFamily: 'sans' }}>
              Create Post
            </Link>
          )}
        </>
      ) : (
        <>
          <Link to="/login" style={{ color: '#FDA481', textDecoration: 'none', fontFamily: 'sans' }}>Login</Link>
          <Link to="/register" style={{ color: '#FDA481', textDecoration: 'none', fontFamily: 'sans' }}>Register</Link>
        </>
      )}

  </div>
  {user && (
    <div>
      <span style={{ marginRight: '10px', color: '#FDA481', fontFamily: 'sans' }}>{user.username} ({user.role})</span>
      <button onClick={onLogout} style={{
        backgroundColor: '#B4182D', // Red
        color: 'white',
        border: 'none',
        padding: '5px 10px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontFamily: 'sans'
      }}>Logout</button>
    </div>
  )}
</nav>
  );
}

export default Navbar;
