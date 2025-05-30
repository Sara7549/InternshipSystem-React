import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChartBar, FaUserGraduate, FaVideo, FaBriefcase, FaFileAlt, FaChalkboardTeacher } from 'react-icons/fa';
import '../styles/StudentList.css';

// Mock auth hook
const useAuth = () => {
  return {
    logout: () => {
      localStorage.removeItem('authToken');
      console.log('User logged out');
    }
  };
};

const StudentsList = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    try {
      const mockData = [
        { id: 1, name: 'Alice Johnson', email: 'alice.johnson@student.example.com', major: 'Computer Science', internshipStatus: 'Accepted' },
        { id: 2, name: 'Bob Smith', email: 'bob.smith@student.example.com', major: 'Graphic Design', internshipStatus: 'Rejected' },
        { id: 3, name: 'Charlie Brown', email: 'charlie.brown@student.example.com', major: 'Architecture', internshipStatus: 'Accepted' },
        { id: 4, name: 'Diana Green', email: 'diana.green@student.example.com', major: 'Fashion Design', internshipStatus: 'Rejected' },
        { id: 5, name: 'Eve White', email: 'eve.white@student.example.com', major: 'Digital Media', internshipStatus: 'Accepted' },
      ];
      setStudents(mockData);
      setFilteredStudents(mockData);
    } catch (err) {
      setError('Failed to load students.');
    }
  }, []);

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredStudents(students);
    } else {
      setFilteredStudents(students.filter(student => student.internshipStatus === statusFilter));
    }
  }, [statusFilter, students]);

  const handleViewProfile = (id) => navigate(`/students/${id}`);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (error) {
    return (
      <div className="students-list-wrapper">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} onLogout={handleLogout} />
        <div className={`students-list-content ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="students-list-wrapper">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} onLogout={handleLogout} />
      <div className={`students-list-content ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
        

        <div className="students-list-container">
          <h2 className="students-title">List of Students</h2>
          <div className="filter-container">
            <label className="filter-label">Filter by Internship Status:</label>
            <div className="filter-buttons">
              {['all', 'Accepted', 'Rejected'].map(status => (
                <button
                  key={status}
                  className={`filter-button ${statusFilter === status ? `filter-button-${status.toLowerCase()}-active` : ''}`}
                  onClick={() => setStatusFilter(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {filteredStudents.length === 0 ? (
            <p className="no-students-message">No students found with the selected filter.</p>
          ) : (
            <div className="table-container">
              <table className="students-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Major</th>
                    <th>Internship Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map(student => (
                    <tr key={student.id}>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{student.major}</td>
                      <td>
                        <span className={`status-badge ${student.internshipStatus === 'Accepted' ? 'status-accepted' : 'status-rejected'}`}>
                          {student.internshipStatus}
                        </span>
                      </td>
                      <td>
                        <button onClick={() => handleViewProfile(student.id)} className="profile-button">View Profile</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({ isOpen, toggleSidebar, onLogout }) => {
  const navigate = useNavigate();

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      {isOpen && (
        <nav className="sidebar-nav">
          <div className="sidebar-header"><h3>SCAD Admin</h3></div>
          <div className="sidebar-menu">
            <button onClick={() => navigate('/scad-dashboard')}><FaChartBar /> Dashboard</button>
            <button onClick={() => navigate('/students')} className="active"><FaUserGraduate /> Students</button>
            <button onClick={() => navigate('/video-call-dashboard')}><FaVideo /> Appointments</button>
            <button onClick={() => navigate('/internships-list')}><FaBriefcase /> Internships</button>
            <button onClick={() => navigate('/submitted-reports')}><FaFileAlt /> Reports</button>
            <button onClick={() => navigate('/career-workshops')}><FaChalkboardTeacher /> Workshops</button>
            <button onClick={() => navigate('/internship-insights-report')}><FaFileAlt /> Generate Reports</button>
            <div className="sidebar-divider"></div>
            <button onClick={onLogout} className="logout-btn">Logout</button>
          </div>
        </nav>
      )}
    </aside>
  );
};

export default StudentsList;
