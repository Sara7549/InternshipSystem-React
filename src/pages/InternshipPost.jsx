//SAMA
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/InternshipPost.css';

const CreateInternshipPost = () => {
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
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user || user.userType !== 'company') {
    navigate('/unauthorized');
    return null;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmitPost = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const newInternship = {
      id: Date.now().toString(),
      companyId: user.email, // Use user.email for consistency
      companyName: user.name,
      ...formData,
      postedDate: new Date().toISOString()
    };

    // Save to localStorage
    const savedInternships = JSON.parse(localStorage.getItem(`internships_${user.email}`)) || [];
    const updatedInternships = [...savedInternships, newInternship];
    localStorage.setItem(`internships_${user.email}`, JSON.stringify(updatedInternships));

    // Update global internships list
    const allInternships = JSON.parse(localStorage.getItem('allInternships')) || [];
    localStorage.setItem('allInternships', JSON.stringify([...allInternships, newInternship]));

    // Create a notification about the internship approval/rejection (random)
    const isAccepted = Math.random() > 0.5;
    const status = isAccepted ? 'accepted' : 'rejected';
    
    const newNotification = {
      id: `notif-${Date.now()}`,
      type: 'application_status',
      status: status,
      internshipId: newInternship.id,
      internshipTitle: newInternship.title,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    // Save notification to localStorage
    const savedNotifications = JSON.parse(localStorage.getItem(`notifications_${user.email}`)) || [];
    const updatedNotifications = [newNotification, ...savedNotifications];
    localStorage.setItem(`notifications_${user.email}`, JSON.stringify(updatedNotifications));

    // Update internship status if rejected
    if (status === 'rejected') {
      const indexToUpdate = updatedInternships.findIndex(internship => internship.id === newInternship.id);
      if (indexToUpdate !== -1) {
        updatedInternships[indexToUpdate].status = 'Rejected';
        localStorage.setItem(`internships_${user.email}`, JSON.stringify(updatedInternships));
        
        // Update global internships list as well
        const updatedAllInternships = JSON.parse(localStorage.getItem('allInternships')) || [];
        const globalIndex = updatedAllInternships.findIndex(internship => internship.id === newInternship.id);
        if (globalIndex !== -1) {
          updatedAllInternships[globalIndex].status = 'Rejected';
          localStorage.setItem('allInternships', JSON.stringify(updatedAllInternships));
        }
      }
    }
    
    // Add a small delay to simulate processing time before redirect
    setTimeout(() => {
      setIsSubmitting(false);
      // Show success message and redirect
      alert(`Internship posted successfully! Your internship has been ${status}.`);
      navigate('/company-dashboard');
    }, 800);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Create New Internship</h1>
        <div className="user-info">
          <span>Company: {user.name}</span>
          <button onClick={() => navigate('/company-dashboard')} className="action-btn">
            Back to Dashboard
          </button>
        </div>
      </header>
      
      <main>
        <div className="company-info">
          <h2>Internship Details</h2>
          <form onSubmit={handleSubmitPost}>
            <div className="form-group">
              <label>Internship Title:</label>
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
              <label>Duration:</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g. 3 months"
                required
              />
            </div>

            <div className="form-group">
              <label>Location:</label>
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
              <label>Application Deadline:</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="paid"
                  checked={formData.paid}
                  onChange={handleChange}
                />
                Paid Position
              </label>
            </div>

            {formData.paid && (
              <div className="form-group">
                <label>Salary/Stipend:</label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="Amount in EGP"
                />
              </div>
            )}

            <div className="form-group">
              <label>Skills Required:</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g. JavaScript, React, UI/UX"
              />
            </div>

            <div className="form-group" style={{ gridColumn: "span 2" }}>
              <label>Job Description:</label>
              <textarea
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleChange}
                rows="6"
                placeholder="Provide a detailed description of the internship role, responsibilities, and requirements"
                required
              />
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Post Internship'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateInternshipPost;