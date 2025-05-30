import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/Dashboard.css';

const EditProfileStudent = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    major: '',
    semester: '',
    interests: '',
    activities: '',
    previousJobs: [],
  });
  const [newJob, setNewJob] = useState({
    company: '',
    duration: '',
    responsibilities: '',
  });
  const majors = [
    'Computer Science',
    'Mechanical Engineering',
    'Business Administration',
    'Civil Engineering',
    'Design',
  ];

  useEffect(() => {
    if (user) {
      // Load existing profile info from localStorage if available
      const storedProfile = JSON.parse(localStorage.getItem(`profile_${user.email}`));
      if (storedProfile) {
         setProfile({ ...storedProfile, previousJobs: storedProfile.previousJobs || [] }); // Ensure previousJobs is an array
      } else {
        // Default to current user data
        setProfile({
          major: user.major || '',
          semester: '',
          interests: '',
          activities: '',
          previousJobs: [],
        });
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewJobChange = (e) => {
    const { name, value } = e.target;
    setNewJob((prev) => ({ ...prev, [name]: value }));
  };

  const addJob = () => {
  setProfile((prev) => ({
    ...prev,
    previousJobs: [...(prev.previousJobs || []), newJob], // Ensure previousJobs is an array
  }));
  setNewJob({
    company: '',
    duration: '',
    responsibilities: '',
  });
};

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem(`profile_${user.email}`, JSON.stringify(profile));
    alert('Profile updated successfully!');
    navigate('/student-dashboard');
  };

  if (!user || user.userType !== 'student') {
    return <div className="login-container"><p>Unauthorized access</p></div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Edit My Profile</h1>
        <button onClick={() => navigate('/student-dashboard')} className="back-btn">
          Back to Dashboard
        </button>
      </header>

      <main className="dashboard-main">
        <form onSubmit={handleSubmit} className="dashboard-card full-width">
          <div className="form-group">
            <label>Name:</label>
            <p>{user.name}</p> {/* Display name as plain text */}
          </div>

          <div className="form-group">
            <label>Major:</label>
            <select
              name="major"
              value={profile.major}
              onChange={handleChange}
              required
            >
              <option value="">Select Major</option>
              {majors.map((major) => (
                <option key={major} value={major}>{major}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Semester:</label>
            <select
              name="semester"
              value={profile.semester}
              onChange={handleChange}
              required
            >
              <option value="">Select Semester</option>
              {Array.from({ length: 8 }, (_, i) => (
                <option key={i + 1} value={i + 1}>Semester {i + 1}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Job Interests:</label>
            <textarea
              name="interests"
              value={profile.interests}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>College Activities:</label>
            <textarea
              name="activities"
              value={profile.activities}
              onChange={handleChange}
            />
          </div>
           <div className="form-group">
            <h3>Previous Internships & Part-Time Jobs</h3>
            {profile.previousJobs.map((job, index) => (
              <div key={index} className="job-item">
                <p><strong>Company:</strong> {job.company}</p>
                <p><strong>Duration:</strong> {job.duration}</p>
                <p><strong>Responsibilities:</strong> {job.responsibilities}</p>
              </div>
            ))}

            <h4>Add New Job</h4>
            <input
              type="text"
              name="company"
              placeholder="Company Name"
              value={newJob.company}
              onChange={handleNewJobChange}
            />
            <input
              type="text"
              name="duration"
              placeholder="Duration (e.g., 6 months)"
              value={newJob.duration}
              onChange={handleNewJobChange}
            />
            <textarea
              name="responsibilities"
              placeholder="Responsibilities"
              value={newJob.responsibilities}
              onChange={handleNewJobChange}
            />
            <button type="button" onClick={addJob} className="add-btn">Add Job</button>
          </div>

          <button type="submit" className="submit-btn">Save Profile</button>
        </form>
      </main>
    </div>
  );
};

export default EditProfileStudent;