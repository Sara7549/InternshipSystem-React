import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/InternshipDetails.css'; // Optional for custom styling

const InternshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [internship, setInternship] = useState(null);

  useEffect(() => {
    // Mock data (in a real app, fetch by ID from API)
    const mockInternships = [
      {
        id: 1,
        company: 'Tech Solutions Inc.',
        jobTitle: 'Software Developer Intern',
        industry: 'Technology',
        duration: '3 months',
        isPaid: true,
        compensation: '$1500/month',
        skills: ['JavaScript', 'React', 'Node.js'],
        description: 'Assist in developing frontend features and integrating backend APIs.',
      },
      {
        id: 2,
        company: 'Green Energy Co.',
        jobTitle: 'Sustainability Analyst Intern',
        industry: 'Energy',
        duration: '6 months',
        isPaid: false,
        compensation: 'Unpaid',
        skills: ['Data Analysis', 'Environmental Studies', 'Excel'],
        description: 'Support energy audits and analyze sustainability data for reports.',
      },
      { 
        id: 3, 
        company: 'Creative Design Studio', 
        jobTitle: 'UX/UI Design Intern',
        industry: 'Design', 
        duration: '3 months', 
        compensation: '$1000/month', 
        isPaid: true, 
        deadline: '2023-06-25',
        skills: ['Figma', 'Sketch', 'UI/UX Design'],
        description: 'Work on designing mobile and web interfaces for our clients.'
      },
      { 
        id: 4, 
        company: 'Global Marketing Group', 
        jobTitle: 'Digital Marketing Intern',
        industry: 'Marketing', 
        duration: '4 months', 
        compensation: '$0', 
        isPaid: false, 
        deadline: '2023-07-05',
        skills: ['SEO', 'Google Analytics', 'Content Marketing'],
        description: 'Assist in running digital marketing campaigns and analyze data.'
      },
      { 
        id: 5, 
        company: 'Architectural Innovations', 
        jobTitle: 'Architectural Visualization Intern',
        industry: 'Architecture', 
        duration: '6 months', 
        compensation: '$1600/month', 
        isPaid: true, 
        deadline: '2023-08-10',
        skills: ['AutoCAD', '3D Modeling', 'Rendering'],
        description: 'Create 3D visualizations of architectural designs and renderings.'
      },
      { 
        id: 6, 
        company: 'Fashion Forward', 
        jobTitle: 'Fashion Design Intern',
        industry: 'Fashion', 
        duration: '3 months', 
        compensation: 'Unpaid', 
        isPaid: false, 
        deadline: '2023-06-20',
        skills: ['Fashion Sketching', 'Adobe Illustrator', 'Textile Design'],
        description: 'Assist with designing clothing collections and fashion sketches.'
      },
      { 
        id: 7, 
        company: 'Sound Studios', 
        jobTitle: 'Sound Design Intern',
        industry: 'Audio Production', 
        duration: '4 months', 
        compensation: '$1250/month', 
        isPaid: true, 
        deadline: '2023-07-30',
        skills: ['Pro Tools', 'Sound Editing', 'Mixing'],
        description: 'Assist in recording and editing sound for various media projects.'
      },
      { 
        id: 8, 
        company: 'Interactive Media Labs', 
        jobTitle: 'Game Development Intern',
        industry: 'Gaming', 
        duration: '6 months', 
        compensation: '$1800/month', 
        isPaid: true, 
        deadline: '2023-08-15',
        skills: ['C++', 'Unity', 'Game Design'],
        description: 'Assist in game development and programming in Unity and C++.'
      }
    ];

    const found = mockInternships.find(item => item.id === parseInt(id));
    setInternship(found);
  }, [id]);

  if (!internship) {
    return <div>Loading internship details...</div>;
  }

  return (
    <div className="details-container">
      <div className="details-buttons">
      <button onClick={() => navigate(-1)} className="back-btn">← Back to Available Internships</button>
      <button onClick={() => navigate('/scad-dashboard')} className="back-btn back-btn-dashboard">← Back to Dashboard</button>
      </div>
      <h1>{internship.jobTitle}</h1>
      <h2>{internship.company}</h2>

      <div className="details-grid">
        <div><strong>Duration:</strong> {internship.duration}</div>
        <div><strong>Paid:</strong> {internship.isPaid ? 'Yes' : 'No'}</div>
        {internship.isPaid && (
          <div><strong>Expected Salary:</strong> {internship.compensation}</div>
        )}
        <div><strong>Skills Required:</strong> {internship.skills.join(', ')}</div>
        <div><strong>Job Description:</strong> {internship.description}</div>
      </div>
    </div>
  );
};

export default InternshipDetails;
