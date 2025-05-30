// src/pages/Login.js
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Automatically determine user type from email pattern
  const inferUserTypeFromEmail = (email) => {
    if (email.endsWith('@company.example.com')) return 'company';
    if (email.endsWith('scad.example.com')) return 'scad';
    if (email.endsWith('@faculty.example.com')) return 'faculty';
    if (email.endsWith('prostudent.example.com')) return 'pro-student';
    return 'student'; // Default fallback
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const detectedUserType = inferUserTypeFromEmail(email);

    if (login(detectedUserType, email, password)) {
      switch (detectedUserType) {
        case 'company':
          navigate('/company-dashboard');
          break;
        case 'scad':
          navigate('/scad-dashboard');
          break;
        case 'faculty':
          navigate('/faculty-dashboard');
          break;
        case 'pro-student':
          navigate('/pro-student-dashboard');
          break;
        default:
          navigate('/student-dashboard');
      }
    } else {
      setError('Invalid credentials or email format.');
    }
  };

   return (
    <div className="login-container">
      <div className="login-card">
        <h2>CareerFusion</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <div className="login-footer">
          <p>Don't have an account? <Link to="/register">Register here</Link></p>
          <p><Link to="/forgot-password">Forgot password?</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
