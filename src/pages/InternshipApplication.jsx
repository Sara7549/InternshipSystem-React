import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/InternshipApplication.css';

const InternshipApplication = () => {
  const { internshipId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [internship, setInternship] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    education: '',
    experience: '',
    coverLetter: '',
    resume: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load all internships to find the one with the matching ID
    const allInternships = JSON.parse(localStorage.getItem('allInternships')) || [];
    const foundInternship = allInternships.find(internship => internship.id === internshipId);
    
    if (foundInternship) {
      setInternship(foundInternship);
    } else {
      alert('Internship not found');
      navigate('/internships');
    }
    
    setIsLoading(false);
  }, [internshipId, navigate]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Create application object
    const newApplication = {
      id: Date.now().toString(),
      studentId: user?.id || 'guest',
      internshipId: internshipId,
      companyId: internship.companyId,
      ...formData,
      resumeFileName: formData.resume ? formData.resume.name : null,
      status: 'Pending',
      submittedDate: new Date().toISOString()
    };
    
    // Save application to localStorage for the company
    const companyApplications = JSON.parse(localStorage.getItem(`applications_${internship.companyId}`)) || {};
    
    // Initialize applications array for this internship if it doesn't exist
    if (!companyApplications[internshipId]) {
      companyApplications[internshipId] = [];
    }
    
    // Add the new application
    companyApplications[internshipId].push(newApplication);
    
    // Save back to localStorage
    localStorage.setItem(`applications_${internship.companyId}`, JSON.stringify(companyApplications));
    
    // Create a notification for the company
    const newNotification = {
      id: Date.now(),
      type: 'new_application',
      studentName: formData.fullName,
      internshipId: internshipId,
      internshipTitle: internship.title,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    // Add notification to company's notifications
    const companyNotifications = JSON.parse(localStorage.getItem(`notifications_${internship.companyId}`)) || [];
    companyNotifications.unshift(newNotification); // Add to beginning of array
    localStorage.setItem(`notifications_${internship.companyId}`, JSON.stringify(companyNotifications));
    
    // Save application to student's applications if logged in
    if (user) {
      const studentApplications = JSON.parse(localStorage.getItem(`studentApplications_${user.id}`)) || [];
      studentApplications.push(newApplication);
      localStorage.setItem(`studentApplications_${user.id}`, JSON.stringify(studentApplications));
    }
    
    // Simulate API call delay
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Application submitted successfully!');
      navigate('/internships');
    }, 1000);
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (!internship) {
    return <div className="error">Internship not found</div>;
  }

  return (
    <div className="application-container">
      <header className="application-header">
        <h1>Apply for Internship</h1>
        <button onClick={() => navigate('/internships')} className="back-btn">
          Back to Listings
        </button>
      </header>
      
      <div className="internship-summary">
        <h2>{internship.title}</h2>
        <p className="company-name">{internship.companyName}</p>
        <div className="internship-meta">
          <span><strong>Location:</strong> {internship.location}</span>
          <span><strong>Duration:</strong> {internship.duration}</span>
          <span><strong>Deadline:</strong> {new Date(internship.deadline).toLocaleDateString()}</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="application-form">
        <h3>Personal Information</h3>
        
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        
        <h3>Education & Experience</h3>
        
        <div className="form-group">
          <label htmlFor="education">Education Background</label>
          <textarea
            id="education"
            name="education"
            rows="3"
            value={formData.education}
            onChange={handleChange}
            placeholder="Include your degree, university, graduation date, and relevant coursework"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="experience">Relevant Experience</label>
          <textarea
            id="experience"
            name="experience"
            rows="4"
            value={formData.experience}
            onChange={handleChange}
            placeholder="List any previous internships, projects, or work experience"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="coverLetter">Cover Letter</label>
          <textarea
            id="coverLetter"
            name="coverLetter"
            rows="6"
            value={formData.coverLetter}
            onChange={handleChange}
            placeholder="Explain why you're interested in this internship and how your skills align with the position"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="resume">Resume (PDF preferred)</label>
          <input
            type="file"
            id="resume"
            name="resume"
            onChange={handleChange}
            accept=".pdf,.doc,.docx"
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
};

export default InternshipApplication;