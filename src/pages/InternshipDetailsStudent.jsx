import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export const internships = [
  {
    id: 1,
    title: 'Software Engineer Intern',
    company: 'TechCorp',
    industry: 'Technology',
    duration: '6 months',
    paid: true,
    compensation: '$1500/month',
    skills: ['JavaScript', 'React', 'Node.js'],
    description: 'Assist in developing frontend features and integrating backend APIs.',
    recommendedBy: ['John Doe', 'Alice Smith'],
  },
  {
    id: 2,
    title: 'Marketing Intern',
    company: 'MarketMasters',
    industry: 'Marketing',
    duration: '3 months',
    paid: false,
    compensation: 'Unpaid',
    skills: ['SEO', 'Google Analytics', 'Content Marketing'],
    description: 'Assist in running digital marketing campaigns and analyze data.',
    recommendedBy: [],
  },
  {
    id: 3,
    title: 'Data Analyst Intern',
    company: 'DataWorld',
    industry: 'Data Analytics',
    duration: '4 months',
    paid: true,
    compensation: '$1200/month',
    skills: ['Data Analysis', 'Excel', 'SQL'],
    description: 'Analyze datasets to extract trends and insights for business decisions.',
    recommendedBy: ['Jane Doe'],
  },
  {
    id: 4,
    title: 'UI/UX Designer Intern',
    company: 'DesignPros',
    industry: 'Design',
    duration: '5 months',
    paid: true,
    compensation: '$1400/month',
    skills: ['Figma', 'Sketch', 'UI/UX Design'],
    description: 'Work on designing mobile and web interfaces for our clients.',
    recommendedBy: [],
  },
  {
    id: 5,
    title: 'Business Analyst Intern',
    company: 'BizAnalytics',
    industry: 'Business',
    duration: '6 months',
    paid: true,
    compensation: '$1600/month',
    skills: ['Business Analysis', 'Excel', 'Communication'],
    description: 'Assist in analyzing market trends and creating business reports.',
    recommendedBy: ['Emily Johnson'],
  },
  {
    id: 6,
    title: 'Graphic Designer Intern',
    company: 'CreativeArts',
    industry: 'Design',
    duration: '3 months',
    paid: false,
    compensation: 'Unpaid',
    skills: ['Adobe Illustrator', 'Photoshop', 'Graphic Design'],
    description: 'Create visual graphics and marketing materials for our campaigns.',
    recommendedBy: [],
  },
  {
    id: 7,
    title: 'Cybersecurity Intern',
    company: 'SecureTech',
    industry: 'Cybersecurity',
    duration: '4 months',
    paid: true,
    compensation: '$1250/month',
    skills: ['Network Security', 'Penetration Testing', 'Python'],
    description: 'Assist in identifying vulnerabilities and securing network systems.',
    recommendedBy: ['Michael Brown'],
  },
  {
    id: 8,
    title: 'Content Writer Intern',
    company: 'WriteNow',
    industry: 'Marketing',
    duration: '2 months',
    paid: false,
    compensation: 'Unpaid',
    skills: ['Content Writing', 'SEO', 'Social Media'],
    description: 'Write and edit content for blogs, websites, and social media platforms.',
    recommendedBy: [],
  },
  {
    id: 9,
    title: 'Machine Learning Intern',
    company: 'FutureAI',
    industry: 'Technology',
    duration: '6 months',
    paid: true,
    compensation: '$1800/month',
    skills: ['Python', 'TensorFlow', 'Machine Learning'],
    description: 'Work on building and training machine learning models for AI solutions.',
    recommendedBy: ['Sophia Wilson'],
  },
  {
    id: 10,
    title: 'Product Manager Intern',
    company: 'InnovateHub',
    industry: 'Business',
    duration: '5 months',
    paid: true,
    compensation: '$1700/month',
    skills: ['Project Management', 'JIRA', 'Communication'],
    description: 'Assist in managing product development and coordinating with teams.',
    recommendedBy: [],
  },
];

const InternshipDetailsStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [internship, setInternship] = useState(null);
  const studentName = 'John Doe';
  useEffect(() => {
    // Find the internship based on the id from the URL
    const foundInternship = internships.find((item) => item.id === parseInt(id, 10));
    setInternship(foundInternship);
  }, [id]);

  const handleRecommend = () => {
  const savedInternships = JSON.parse(localStorage.getItem('internships'));
// Update the recommendedBy field
    const updatedInternships = savedInternships.map((item) => {
      if (item.id === internship.id) {
        return {
          ...item,
          recommendedBy: [...new Set([...item.recommendedBy, studentName])], // Avoid duplicates
        };
      }
      return item;
    });

    // Save to local storage and update state
    localStorage.setItem('internships', JSON.stringify(updatedInternships));
    setInternship((prev) => ({
      ...prev,
      recommendedBy: [...new Set([...prev.recommendedBy, studentName])],
    }));
  };
  if (!internship) {
    return <div>Loading internship details...</div>;
  }

  return (
    <div className="details-container">
      <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
      <h1>{internship.title}</h1>
      <h2>{internship.company}</h2>

      <div className="details-grid">
        <div><strong>Industry:</strong> {internship.industry}</div>
        <div><strong>Duration:</strong> {internship.duration}</div>
        <div><strong>Paid:</strong> {internship.paid ? 'Yes' : 'No'}</div>
        {internship.paid && (
          <div><strong>Compensation:</strong> {internship.compensation}</div>
        )}
        <div><strong>Skills Required:</strong> {internship.skills.join(', ')}</div>
        <div><strong>Description:</strong> {internship.description}</div>
        {internship.recommendedBy.length > 0 && (
          <div><strong>Recommended By:</strong> {internship.recommendedBy.join(', ')}</div>
        )}
      </div>
    </div>
  );
};

export default InternshipDetailsStudent;