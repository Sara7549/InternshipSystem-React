//SAMA
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/ApplicationsManagement.css';

const DummyDetailsForCompany = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.studentData) {
    return (
      <div className="error-container">
        <h2>Student data not available</h2>
        <button onClick={() => navigate('/view-applications')} className="back-button">
          Return to Applications
        </button>
      </div>
    );
  }

  const { studentData, internshipTitle } = state;

  return (
    <div className="student-details-container">
      <button onClick={() => navigate('/view-applications')} className="back-button">
        ← Back to Applications
      </button>

      <div className="student-profile">
        <h1>{studentData.name}</h1>
        <div className="profile-section">
          <h2>Contact Information</h2>
          <p><strong>Email:</strong> {studentData.email}</p>
          <p><strong>Phone:</strong> {studentData.phone || 'Not provided'}</p>
        </div>

        <div className="profile-section">
          <h2>Education</h2>
          <p><strong>University:</strong> {studentData.university || 'Not specified'}</p>
          <p><strong>Major:</strong> {studentData.major || 'Not specified'}</p>
          <p><strong>GPA:</strong> {studentData.gpa || 'Not specified'}</p>
        </div>

        <div className="profile-section">
          <h2>Internship Information</h2>
          <p><strong>Position:</strong> {internshipTitle}</p>
          <p><strong>Status:</strong> 
            <span className={`status-tag ${studentData.status?.toLowerCase()}`}>
              {studentData.status || 'Pending'}
            </span>
          </p>
        </div>

        {studentData.coverLetter && (
          <div className="profile-section">
            <h2>Cover Letter</h2>
            <div className="cover-letter">
              {studentData.coverLetter}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DummyDetailsForCompany;