//SAMA
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/InternshipPost.css';

const EditInternship = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    duration: '',
    paid: false,
    salary: '',
    skills: '',
    jobDescription: '',
    location: '',
    deadline: '',
    status: 'Open'
  });

  useEffect(() => {
    if (user && id) {
      const savedInternships = JSON.parse(localStorage.getItem(`internships_${user.email}`)) || [];
      const internshipToEdit = savedInternships.find(internship => internship.id === id);
      
      if (internshipToEdit) {
        setFormData({
          title: internshipToEdit.title || '',
          duration: internshipToEdit.duration || '',
          paid: internshipToEdit.paid || false,
          salary: internshipToEdit.salary || '',
          skills: internshipToEdit.skills || '',
          jobDescription: internshipToEdit.jobDescription || '',
          location: internshipToEdit.location || '',
          deadline: internshipToEdit.deadline || '',
          status: internshipToEdit.status || 'Open'
        });
      } else {
        navigate('/company-dashboard');
      }
    }
  }, [id, user, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!user) return;

    const savedInternships = JSON.parse(localStorage.getItem(`internships_${user.email}`)) || [];
    
    // Find the index of the internship to update
    const internshipIndex = savedInternships.findIndex(internship => internship.id === id);
    
    if (internshipIndex === -1) {
      alert('Internship not found!');
      return;
    }

    // Create updated internship object
    const updatedInternship = { 
      ...savedInternships[internshipIndex], 
      ...formData,
      // Ensure these fields are properly formatted
      deadline: formData.deadline || savedInternships[internshipIndex].deadline,
      salary: formData.paid ? formData.salary : ''
    };

    // Update the array
    const updatedInternships = [...savedInternships];
    updatedInternships[internshipIndex] = updatedInternship;
    
    // Save back to localStorage
    localStorage.setItem(`internships_${user.email}`, JSON.stringify(updatedInternships));
    
    // Update global internships list as well
    const allInternships = JSON.parse(localStorage.getItem('allInternships')) || [];
    const updatedAllInternships = allInternships.map(internship => 
      internship.id === id ? updatedInternship : internship
    );
    localStorage.setItem('allInternships', JSON.stringify(updatedAllInternships));
    
    alert('Internship updated successfully!');
    navigate('/company-dashboard');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="internship-post-container">
      <header className="internship-post-header">
        <h1>Edit Internship Post</h1>
        <button onClick={() => navigate('/company-dashboard')} className="back-btn">
          Back to Dashboard
        </button>
      </header>
      
      <form className="internship-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Internship Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Web Development Intern"
              required
            />
          </div>

          <div className="form-group">
            <label>Duration</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g. 3 months"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="City, State or Remote"
              required
            />
          </div>

          <div className="form-group">
            <label>Application Deadline</label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="paid"
                checked={formData.paid}
                onChange={handleChange}
                style={{ marginRight: '8px' }}
              />
              Paid Position
            </label>
            {formData.paid && (
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="Amount in EGP"
                style={{ marginTop: '8px' }}
              />
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Skills Required</label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g. JavaScript, React, UI/UX"
          />
        </div>

        <div className="form-group">
          <label>Job Description</label>
          <textarea
            name="jobDescription"
            value={formData.jobDescription}
            onChange={handleChange}
            rows="6"
            placeholder="Provide a detailed description of the internship role, responsibilities, and requirements"
            required
          />
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate('/company-dashboard')}>
            Cancel
          </button>
          <button type="submit" className="submit-btn">
            Update Internship
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditInternship;