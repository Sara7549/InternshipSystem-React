import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/ApplicationsManagement.css';
import { HARDCODED_INTERNSHIPS } from '../data/mockInternships';
import { HARDCODED_APPLICATIONS } from '../data/mockApplications';

const ViewApplications = () => {
  const { user } = useContext(AuthContext);
  const { internshipId } = useParams();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [internships, setInternships] = useState(HARDCODED_INTERNSHIPS);
  const [selectedInternshipFilter, setSelectedInternshipFilter] = useState(internshipId || 'all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user === null) {
      return;
    }
    if (!user || user.userType !== 'company') {
      navigate('/login');
    } else {
      setIsLoading(false);
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user && user.userType === 'company' && !isLoading) {
      const savedInternships = localStorage.getItem(`internships_${user.email}`);
      if (savedInternships) {
        setInternships(JSON.parse(savedInternships));
      }

      const savedApplications = localStorage.getItem(`applications_${user.email}`);
      let allApplications = [];
      if (savedApplications) {
        const appData = JSON.parse(savedApplications);
        Object.entries(appData).forEach(([intId, internshipApplications]) => {
          internshipApplications.forEach((app) => {
            allApplications.push({
              ...app,
              internshipId: String(intId),
            });
          });
        });
      } else {
        Object.entries(HARDCODED_APPLICATIONS).forEach(([intId, internshipApplications]) => {
          internshipApplications.forEach((app) => {
            allApplications.push({
              ...app,
              internshipId: String(intId),
            });
          });
        });
        localStorage.setItem(`applications_${user.email}`, JSON.stringify(HARDCODED_APPLICATIONS));
      }
      setApplications(allApplications);

      if (internshipId) {
        setSelectedInternshipFilter(String(internshipId));
        setStatusFilter('all');
        setSearchTerm('');
      }
    }
  }, [user, internshipId, isLoading]);

  const getInternshipTitle = (id) => {
    const internship = internships.find((int) => int.id === id);
    return internship ? internship.title : 'Unknown Internship';
  };

  const getExistingEvaluation = (studentId) => {
    const evaluationsKey = `evaluations_${user.email}`;
    const evaluations = JSON.parse(localStorage.getItem(evaluationsKey)) || {};
    return evaluations[studentId];
  };

  const handleViewStudentDetails = (application) => {
    navigate(`/company-view-student/${application.studentId}`, {
      state: {
        studentData: application,
        internshipTitle: getInternshipTitle(application.internshipId),
      },
    });
  };

  const handleUpdateStatus = (applicationId, newStatus) => {
    const updatedApplications = applications.map((app) => {
      if (app.id === applicationId) {
        return { ...app, status: newStatus };
      }
      return app;
    });

    setApplications(updatedApplications);
    localStorage.setItem(
      `applications_${user.email}`,
      JSON.stringify(
        updatedApplications.reduce((acc, app) => {
          if (!acc[app.internshipId]) acc[app.internshipId] = [];
          const { internshipId, ...rest } = app;
          acc[app.internshipId].push(rest);
          return acc;
        }, {})
      )
    );
    alert(`Application status updated to "${newStatus}"`);
  };

 const handleEvaluateStudent = (application) => {
  navigate('/evaluation-form', {
    state: {
      student: {
        id: application.studentId,
        name: application.name,
        status: application.status,
        university: application.university,
      },
      internship: {
        id: application.internshipId,
        title: getInternshipTitle(application.internshipId),
      },
      existingEvaluation: getExistingEvaluation(application.studentId),
      returnTo: `/view-applications/${application.internshipId}` // Add this line
    }
  });
};

  const filteredApplications = applications.filter((app) => {
    const matchesInternship =
      selectedInternshipFilter === 'all' ||
      String(app.internshipId) === String(selectedInternshipFilter);
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesSearch =
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.university && app.university.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesInternship && matchesStatus && matchesSearch;
  });

  if (isLoading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (!user || user.userType !== 'company') {
    return null;
  }

  return (
    <div className="applications-management">
      <header className="applications-header">
        <h1>Internship Applications</h1>
        <button onClick={() => navigate('/company-dashboard')} className="back-btn">
          <span className="back-icon">←</span> Back to Dashboard
        </button>
      </header>

      <div className="tabs-container">
        <div className="controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name or university..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              aria-label="Search applications"
            />
            <i className="search-icon">🔍</i>
          </div>
          <div className="filters">
            <div className="filter">
              <label htmlFor="internship-filter">Internship:</label>
              <select
                id="internship-filter"
                value={selectedInternshipFilter}
                onChange={(e) => setSelectedInternshipFilter(e.target.value)}
                className="filter-select"
                aria-label="Filter by internship"
              >
                <option value="all">All Internships</option>
                {internships.map((internship) => (
                  <option key={internship.id} value={internship.id}>
                    {internship.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter">
              <label htmlFor="status-filter">Status:</label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
                aria-label="Filter by status"
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
                <option value="Finalized">Finalized</option>
                <option value="Current Intern">Current Intern</option>
                <option value="Internship Complete">Internship Complete</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="content-area">
        <div className="list-container">
          <h2>Applications</h2>
          {filteredApplications.length > 0 ? (
            <div className="applications-list">
              {filteredApplications.map((application) => (
                <div key={application.id} className="application-card">
                  <div className="card-header">
                    <h3>{application.name}</h3>
                    <div className="status-selector">
                      <select
                        value={application.status || 'Pending'}
                        onChange={(e) => handleUpdateStatus(application.id, e.target.value)}
                        className="status-dropdown"
                        aria-label={`Update status for ${application.name}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Finalized">Finalized</option>
                        <option value="Current Intern">Current Intern</option>
                        <option value="Internship Complete">Internship Complete</option>
                      </select>
                    </div>
                  </div>

                  <div className="card-body">
                    <p>
                      <strong>Internship:</strong> {getInternshipTitle(application.internshipId)}
                    </p>
                    <p>
                      <strong>University:</strong> {application.university || 'Not specified'}
                    </p>
                    <p>
                      <strong>Applied:</strong>{' '}
                      {new Date(application.appliedDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="card-footer">
                    <button
                      onClick={() => handleViewStudentDetails(application)}
                      className="details-button"
                    >
                      View Full Details
                    </button>
                    {application.status === 'Internship Complete' && (
                      <button
                        onClick={() => handleEvaluateStudent(application)}
                        className="evaluate-button"
                      >
                        {getExistingEvaluation(application.studentId)
                          ? 'Edit Evaluation'
                          : 'Create Evaluation'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">No applications match current filters</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewApplications;