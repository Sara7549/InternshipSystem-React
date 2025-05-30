import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css'; // Reuse same styling for consistency

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'student',
    // Company-specific fields
    companyName: '',
    industry: '',
    companySize: '',
    companyLogo: null
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === 'companyLogo') {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleCompanySizeSelection = (size) => {
    setFormData({ ...formData, companySize: size });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const { name, email, password, confirmPassword, userType } = formData;

    // Basic validation for all users
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Additional validation for companies
    if (userType === 'company') {
      const { companyName, industry, companySize } = formData;
      if (!companyName || !industry || !companySize) {
        setError('Please fill in all company details');
        return;
      }
    }

    // Simulated registration logic
    console.log('User registered:', formData);
    alert('Registration successful! You can now log in.');
    navigate('/');
  };

  const companySizeOptions = [
    { value: 'small', label: 'Small (≤50 employees)' },
    { value: 'medium', label: 'Medium (51-100 employees)' },
    { value: 'large', label: 'Large (101-500 employees)' },
    { value: 'corporate', label: 'Corporate (>500 employees)' }
  ];

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Create an Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="userType">I am a:</label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              required
            >
              <option value="student">Student</option>
              <option value="pro-student">PRO Student</option>
              <option value="company">Company</option>
              <option value="scad">SCAD Office</option>
              <option value="faculty">Faculty Member</option>
            </select>
          </div>

          {formData.userType === 'company' && (
            <>
              <div className="form-group">
                <label htmlFor="companyName">Company Name:</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Enter your company name"
                  required={formData.userType === 'company'}
                />
              </div>

              <div className="form-group">
                <label htmlFor="industry">Industry:</label>
                <input
                  type="text"
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  placeholder="Enter your industry"
                  required={formData.userType === 'company'}
                />
              </div>

              <div className="form-group">
                <label>Company Size:</label>
                <div className="company-size-options">
                  {companySizeOptions.map((option) => (
                    <div 
                      key={option.value}
                      className={`company-size-option ${formData.companySize === option.value ? 'selected' : ''}`}
                      onClick={() => handleCompanySizeSelection(option.value)}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
                <input
                  type="hidden"
                  name="companySize"
                  value={formData.companySize}
                  required={formData.userType === 'company'}
                />
              </div>

              <div className="form-group">
                <label htmlFor="companyLogo">Company Logo:</label>
                <input
                  type="file"
                  id="companyLogo"
                  name="companyLogo"
                  onChange={handleChange}
                  accept="image/*"
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="name">Full Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button">
            Register
          </button>
        </form>

        <div className="login-footer">
          <p>Already have an account? <a href="/">Login here</a></p>
        </div>
      </div>
    </div>
  );
};

export default Register;