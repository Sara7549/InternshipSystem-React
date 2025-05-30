import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaChartBar,
  FaUserGraduate,
  FaBriefcase,
  FaFileAlt,
  FaChalkboardTeacher,
  FaSignOutAlt
} from 'react-icons/fa';
import '../styles/StudentProfile.css'; 

const StudentProfilePage = () => {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const mockData = [
      {
        id: 1,
        name: 'Alice Johnson',
        email: 'alice.johnson@student.example.com',
        major: 'Computer Science',
        internshipStatus: 'Accepted',
        gpa: 3.8,
        year: 'Junior',
        skills: ['JavaScript', 'React', 'Node.js', 'Python'],
        bio: 'Passionate about web development and machine learning.',
        photo: 'https://via.placeholder.com/150'
      },
      {
        id: 2,
        name: 'Bob Smith',
        email: 'bob.smith@student.example.com',
        major: 'Graphic Design',
        internshipStatus: 'Rejected',
        gpa: 3.5,
        year: 'Senior',
        skills: ['Adobe Photoshop', 'Illustrator', 'UI/UX', 'Typography'],
        bio: 'Creative designer with a passion for branding.',
        photo: 'https://via.placeholder.com/150'
      },
      {
        id: 3,
        name: 'Charlie Brown',
        email: 'charlie.brown@student.example.com',
        major: 'Architecture',
        internshipStatus: 'Accepted',
        gpa: 3.9,
        year: 'Senior',
        skills: ['AutoCAD', 'Revit', '3D Modeling', 'Sustainable Design'],
        bio: 'Interested in sustainable architecture and urban planning.',
        photo: 'https://via.placeholder.com/150'
      },
      {
        id: 4,
        name: 'Diana Green',
        email: 'diana.green@student.example.com',
        major: 'Fashion Design',
        internshipStatus: 'Rejected',
        gpa: 3.6,
        year: 'Sophomore',
        skills: ['Sketching', 'Sewing', 'Pattern Making', 'Textile Design'],
        bio: 'Aspiring fashion designer with a focus on sustainable fashion.',
        photo: 'https://via.placeholder.com/150'
      },
      {
        id: 5,
        name: 'Eve White',
        email: 'eve.white@student.example.com',
        major: 'Digital Media',
        internshipStatus: 'Accepted',
        gpa: 4.0,
        year: 'Junior',
        skills: ['Video Editing', 'Animation', 'Social Media', 'Content Creation'],
        bio: 'Digital content creator with a knack for storytelling.',
        photo: 'https://via.placeholder.com/150'
      }
    ];

    const foundStudent = mockData.find(s => s.id === parseInt(studentId));
    setStudent(foundStudent);
  }, [studentId]);

  const handleLogout = () => {
    navigate('/login');
  };

  if (student === null) {
    return <div className="student-profile-container">Loading student profile...</div>;
  }

  if (!student) {
    return <div className="student-profile-container">Student not found.</div>;
  }

  return (
    <div className="dashboard-layout">
      {/* Fixed Sidebar */}
      <aside className="sidebar">
        <nav className="sidebar-nav">
          <div className="sidebar-header">
            <h3>SCAD Admin</h3>
          </div>
          <div className="sidebar-menu">
            <button onClick={() => navigate('/scad-dashboard')}><FaChartBar /> Dashboard</button>
            <button onClick={() => navigate('/students')} className="active"><FaUserGraduate /> Students</button>
            <button onClick={() => navigate('/video-call-dashboard')}><FaBriefcase /> Appointments</button>
            <button onClick={() => navigate('/internships-list')}><FaBriefcase /> Internships</button>
            <button onClick={() => navigate('/submitted-reports')}><FaFileAlt /> Reports</button>
            <button onClick={() => navigate('/career-workshops')}><FaChalkboardTeacher /> Workshops</button>
            <button onClick={() => navigate('/internship-insights-report')}><FaFileAlt /> Generate Reports</button>
            <div className="sidebar-divider"></div>
            <button className='logout-btn' onClick={handleLogout}><FaSignOutAlt /> Logout</button>
          </div>
        </nav>
      </aside>

      {/* Main Profile Content */}
      <div className="student-profile-main">
        <div className="button-bar">
          <button onClick={() => navigate('/students')} className="back-buttonp">
            ← Back to Student List
          </button>
         
        </div>

        <div className="student-header">
          <img src={student.photo} alt={student.name} />
          <div>
            <h2>{student.name}</h2>
            <p>{student.major}, {student.year}</p>
            <p>GPA: {student.gpa}</p>
            <span className={student.internshipStatus === 'Accepted' ? 'status-accepted' : 'status-rejected'}>
              {student.internshipStatus}
            </span>
          </div>
        </div>

        <div className="student-section">
          <h3>Email</h3>
          <p>{student.email}</p>
        </div>

        <div className="student-section">
          <h3>About</h3>
          <p>{student.bio}</p>
        </div>

        <div className="student-section">
          <h3>Skills</h3>
          <div>
            {student.skills.map((skill, idx) => (
              <span key={idx} className="skill-badge">{skill}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
