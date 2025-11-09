import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PostList from './components/PostList';
import Login from './components/Login';
import Register from './components/Register';
import CreatePost from './components/CreatePost';
import Navbar from './components/Navbar'; 

function App() {
  const [user, setting] = useState(null);


  useEffect(() => {
    fetch('http://localhost:5000/api/auth/me', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        setting(data.user); // store session user
      });
      
      
  }, []);

  const handleLogout = async () => {
    await fetch('http://localhost:5000/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
    setting(null); // clear user on logout
  };

  return (
    <Router>
  <Navbar user={user} onLogout={handleLogout} />

 
  <div style={{
    backgroundColor: '#FEE3D8',
    padding: '10px 20px',
    position: 'relative'
  }}>
    <div style={{
      position: 'absolute',
      top: '10px',
      right: '20px',
      backgroundColor: '#0D1E4C',
      color: '#C48CB3',
      padding: '8px 16px',
      fontSize: '22px',
      fontWeight: 'bold',
      fontFamily: 'Georgia, serif',
      borderRadius: '10px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
    }}>
      book.<span style={{ color: '#E5C9D7' }}>O<span style={{ color: '#C48CB3' }}>.gram</span></span>
    </div>
  </div>

  <Routes>
    <Route path="/" element={<PostList user={user} />} />
    <Route path="/login" element={<Login setting={setting} />} />
    <Route path="/register" element={<Register />} />
    <Route path="/create/:id" element={<CreatePost user={user} />} />  
    <Route path="/create" element={<CreatePost user={user} />} />     

  </Routes>
</Router>


  );
}

export default App;
