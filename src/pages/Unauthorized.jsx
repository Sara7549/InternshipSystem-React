import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css'; // Reuse the login styling

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Unauthorized Access</h2>
        <div className="error-message">
          You do not have permission to access this page.
        </div>
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          Please log in with the appropriate account to access this resource.
        </p>
        <button 
          onClick={() => navigate('/login')} 
          className="login-button"
          style={{ marginTop: '20px' }}
        >
          Return to Login
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;