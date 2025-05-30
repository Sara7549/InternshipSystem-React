import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/CompanyDetails.css'; // Import the CSS for styling

const CompanyDetailsPro = () => {
  const { id } = useParams(); // Get company id from URL
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const { user } = useContext(AuthContext); 

  useEffect(() => {
    // Simulate fetching data based on company ID
    const mockData = [
      { id: 1, name: 'Tech Solutions Inc.', industry: 'Technology', applicationDate: '2023-05-15', description: 'A leading tech company specializing in cloud solutions.' },
      { id: 2, name: 'Green Energy Co.', industry: 'Energy', applicationDate: '2023-05-18', description: 'Renewable energy company focused on sustainable solutions.' },
      { id: 3, name: 'Creative Design Studio', industry: 'Design', applicationDate: '2023-05-20', description: 'A creative agency specializing in branding and design.' },
      { id: 4, name: 'Global Marketing Group', industry: 'Marketing', applicationDate: '2023-05-22', description: 'An agency offering global marketing strategies.' },
      { id: 5, name: 'Architectural Innovations', industry: 'Architecture', applicationDate: '2023-06-02', description: 'Pioneering sustainable architecture.' },
      { id: 6, name: 'Fashion Forward', industry: 'Fashion', applicationDate: '2023-06-07', description: 'Leading fashion company shaping trends.' },
      { id: 7, name: 'Sound Studios', industry: 'Audio Production', applicationDate: '2023-06-12', description: 'High-quality audio production studio.' },
      { id: 8, name: 'Interactive Media Labs', industry: 'Gaming', applicationDate: '2023-06-17', description: 'Innovative gaming studio creating immersive experiences.' }
    ];

    // Fetch the company data based on the provided id
    const selectedCompany = mockData.find(comp => comp.id === parseInt(id));
    setCompany(selectedCompany);
  }, [id]); // Re-run effect when the company ID changes

  const handleGoBack = () => {
    // Determine which dashboard to return to based on user type
    if (user && user.userType === 'scad') {
      navigate('/scad-dashboard');
    } else if (user && user.userType === 'pro-student') {
      navigate('/pro-student-dashboard');
    } else {
      // Default fallback if user type is unknown
      navigate(-1); // Go back to previous page
    }
  }; 
   if (!company) {
    return <div>Loading...</div>; // Show loading state while data is being fetched
  }

  return (
    <div className="company-details-container">
      <header className="company-details-header">
        <h1>{company.name}</h1>
        <button onClick={handleGoBack} className="back-button">Back to Dashboard</button>
      </header>

      <div className="company-details-content">
        <div className="company-details-section">
          <h2>Company Information</h2>
          <p><strong>Industry:</strong> {company.industry}</p>
          <p><strong>Application Date:</strong> {company.applicationDate}</p>
          <p><strong>Description:</strong> {company.description}</p>
        </div>
        </div>
    </div>
  );
};

export default CompanyDetailsPro;