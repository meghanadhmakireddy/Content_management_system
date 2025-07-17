import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
  fetch('http://localhost:5000/api/auth/me', {
    credentials: 'include'
  })
    .then(res => res.json())
    .then(data => {
      if (!data.user) {
        navigate('/login');  // ✅ correct redirection now
      } else {
        setAllowed(true);
      }
      setChecking(false);
    })
    .catch(() => {
      navigate('/login');
      setChecking(false);
    });
}, [navigate]);

  if (checking) return <p>Checking authentication...</p>;
  if (!allowed) return null;

  return children;
}

export default ProtectedRoute;
