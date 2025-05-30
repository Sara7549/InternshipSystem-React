import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/Dashboard.css';

const EditProfile = () => {
const { user, login } = useContext(AuthContext);
const navigate = useNavigate();

const [profile, setProfile] = useState({
name: '',
major: '',
year: '',
interests: '',
experience: '',
activities: ''
});

useEffect(() => {
if (user) {
// Load existing profile info from localStorage if available
const storedProfile = JSON.parse(localStorage.getItem(`profile_${user.email}`));
if (storedProfile) {
setProfile(storedProfile);
} else {
// Default to current user data
setProfile({
name: user.name || '',
major: user.major || '',
year: user.year || '',
interests: '',
experience: '',
activities: ''
});
}
}
}, [user]);

const handleChange = (e) => {
const { name, value } = e.target;
setProfile(prev => ({ ...prev, [name]: value }));
};

const handleSubmit = (e) => {
e.preventDefault();
localStorage.setItem(`profile_${user.email}`, JSON.stringify(profile));
alert('Profile updated successfully!');
navigate('/pro-student-dashboard');
};

if (!user || user.userType !== 'pro-student') {
return <div className="login-container"><p>Unauthorized access</p></div>;
}

return (
<div className="dashboard-container">
<header className="dashboard-header">
<h1>Edit My Profile</h1>
<button onClick={() => navigate('/pro-student-dashboard')} className="back-btn">
Back to Dashboard
</button>
</header>

  <main className="dashboard-main">
    <form onSubmit={handleSubmit} className="dashboard-card full-width">
      <div className="form-group">
        <label>Name:</label>
        <input type="text" name="name" value={profile.name} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Major:</label>
        <input type="text" name="major" value={profile.major} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Year:</label>
        <input type="text" name="year" value={profile.year} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Job Interests:</label>
        <textarea name="interests" value={profile.interests} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Previous Internships or Part-time Jobs:</label>
        <textarea name="experience" value={profile.experience} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>College Activities:</label>
        <textarea name="activities" value={profile.activities} onChange={handleChange} />
      </div>

      <button type="submit" className="submit-btn">Save Profile</button>
    </form>
  </main>
</div>
);
};

export default EditProfile;


