import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css'; // Use same theme as Login

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    // Simulated success message
    setMessage('If this email is registered, a password reset link has been sent.');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Forgot Your Password?</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Enter your registered email:</label>
            <input
              type="email"
              id="email"
              placeholder="example@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}

          <button type="submit" className="login-button">
            Send Reset Link
          </button>
        </form>

        <div className="login-footer">
          <p><a href="/">Back to Login</a></p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
