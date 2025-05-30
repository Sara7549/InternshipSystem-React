//SAMA
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/ApplicationsManagement.css';
import { HARDCODED_INTERNSHIPS } from '../data/mockInternships';
import { HARDCODED_APPLICATIONS } from '../data/mockApplications';

const ApplicationsManagement = () => {
  const { user } = useContext(AuthContext);
  const { internshipId } = useParams();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [interns, setInterns] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [internships, setInternships] = useState(HARDCODED_INTERNSHIPS);
  const [selectedInternshipFilter, setSelectedInternshipFilter] = useState(internshipId || 'all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showEvaluationForm, setShowEvaluationForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [evaluationForm, setEvaluationForm] = useState({
    technicalSkills: '',
    communicationSkills: '',
    teamwork: '',
    punctuality: '',
    overallPerformance: '',
    comments: '',
    recommendForHire: false
  });

  useEffect(() => {
    if (user === null) {
      // User is still loading, wait
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
      } else {
        localStorage.setItem(`internships_${user.email}`, JSON.stringify(HARDCODED_INTERNSHIPS));
        setInternships(HARDCODED_INTERNSHIPS);
      }

      const savedApplications = localStorage.getItem(`applications_${user.email}`);
      if (savedApplications) {
        const appData = JSON.parse(savedApplications);
        const allApplications = [];
        Object.entries(appData).forEach(([internshipId, internshipApplications]) => {
          internshipApplications.forEach(app => {
            allApplications.push({
              ...app,
              internshipId: String(internshipId)
            });
          });
        });
        setApplications(allApplications);
      } else {
        const allApplications = [];
        Object.entries(HARDCODED_APPLICATIONS).forEach(([internshipId, internshipApplications]) => {
          internshipApplications.forEach(app => {
            allApplications.push({
              ...app,
              internshipId: String(internshipId)
            });
          });
        });
        localStorage.setItem(`applications_${user.email}`, JSON.stringify(HARDCODED_APPLICATIONS));
        setApplications(allApplications);
      }

      const savedInterns = localStorage.getItem(`interns_${user.email}`);
      if (savedInterns) {
        setInterns(JSON.parse(savedInterns));
      }

      if (internshipId) {
        setSelectedInternshipFilter(String(internshipId));
        setSelectedIntern(null);
        setStatusFilter('all');
        setSearchTerm('');
      }
    }
  }, [user, internshipId, isLoading]);

  if (isLoading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (!user || user.userType !== 'company') {
    return null;
  }

  const getInternshipTitle = (id) => {
    const internship = internships.find(int => int.id === id);
    return internship ? internship.title : 'Unknown Internship';
  };

  const handleViewApplicationDetails = (application) => {
    setSelectedApplication(application);
    setSelectedIntern(null);
    setShowEvaluationForm(false);
  };

  const handleViewInternDetails = (intern) => {
    setSelectedIntern(intern);
    setSelectedApplication(null);
    if (intern.status === 'Internship Complete') {
      const evaluations = JSON.parse(localStorage.getItem(`evaluations_${user.email}`)) || {};
      const internEvaluation = evaluations[intern.id];
      if (internEvaluation) {
        setEvaluationForm(internEvaluation);
      } else {
        setEvaluationForm({
          technicalSkills: '',
          communicationSkills: '',
          teamwork: '',
          punctuality: '',
          overallPerformance: '',
          comments: '',
          recommendForHire: false
        });
      }
    }
  };

  const handleCloseDetails = () => {
    setSelectedApplication(null);
    setSelectedIntern(null);
    setShowEvaluationForm(false);
  };

  const handleUpdateApplicationStatus = (application, newStatus) => {
    const updatedApplications = applications.map(app => {
      if (app.id === application.id) {
        return { ...app, status: newStatus };
      }
      return app;
    });
    
    setApplications(updatedApplications);
    
    const applicationsByInternship = {};
    updatedApplications.forEach(app => {
      if (!applicationsByInternship[app.internshipId]) {
        applicationsByInternship[app.internshipId] = [];
      }
      const { internshipId, ...appWithoutInternshipId } = app;
      applicationsByInternship[app.internshipId].push(appWithoutInternshipId);
    });
    
    localStorage.setItem(`applications_${user.email}`, JSON.stringify(applicationsByInternship));
    
    if (newStatus === 'Current Intern') {
      const internship = internships.find(int => int.id === application.internshipId);
      const newIntern = {
        id: application.id,
        name: application.fullName,
        email: application.email,
        phone: application.phone,
        internshipId: application.internshipId,
        internshipTitle: internship ? internship.title : 'Unknown Position',
        startDate: new Date().toISOString(),
        status: 'Current Intern'
      };
      
      const updatedInterns = [...interns, newIntern];
      setInterns(updatedInterns);
      localStorage.setItem(`interns_${user.email}`, JSON.stringify(updatedInterns));
    }
    
    if (selectedApplication && selectedApplication.id === application.id) {
      setSelectedApplication({...application, status: newStatus});
    }
    
    alert(`Application status updated to "${newStatus}"`);
  };

  const handleUpdateInternStatus = (intern, newStatus) => {
    const updatedInterns = interns.map(int => {
      if (int.id === intern.id) {
        return { 
          ...int, 
          status: newStatus,
          completionDate: newStatus === 'Internship Complete' ? new Date().toISOString() : int.completionDate
        };
      }
      return int;
    });
    
    setInterns(updatedInterns);
    localStorage.setItem(`interns_${user.email}`, JSON.stringify(updatedInterns));
    
    if (selectedIntern && selectedIntern.id === intern.id) {
      setSelectedIntern({
        ...intern, 
        status: newStatus,
        completionDate: newStatus === 'Internship Complete' ? new Date().toISOString() : intern.completionDate
      });
    }
    
    alert(`Intern status updated to "${newStatus}"`);
    
    if (newStatus === 'Internship Complete') {
      setShowEvaluationForm(true);
    }
  };

  const handleEvaluationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEvaluationForm({
      ...evaluationForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmitEvaluation = (e) => {
    e.preventDefault();
    
    if (!selectedIntern) return;
    
    const savedEvaluations = JSON.parse(localStorage.getItem(`evaluations_${user.email}`)) || {};
    savedEvaluations[selectedIntern.id] = {
      ...evaluationForm,
      internId: selectedIntern.id,
      internName: selectedIntern.name,
      internshipTitle: selectedIntern.internshipTitle,
      evaluationDate: new Date().toISOString()
    };
    
    localStorage.setItem(`evaluations_${user.email}`, JSON.stringify(savedEvaluations));
    
    alert('Evaluation submitted successfully!');
    setShowEvaluationForm(false);
  };

  const handleDeleteEvaluation = () => {
    if (!selectedIntern) return;
    
    if (window.confirm('Are you sure you want to delete this evaluation?')) {
      const savedEvaluations = JSON.parse(localStorage.getItem(`evaluations_${user.email}`)) || {};
      delete savedEvaluations[selectedIntern.id];
      
      localStorage.setItem(`evaluations_${user.email}`, JSON.stringify(savedEvaluations));
      
      setEvaluationForm({
        technicalSkills: '',
        communicationSkills: '',
        teamwork: '',
        punctuality: '',
        overallPerformance: '',
        comments: '',
        recommendForHire: false
      });
      
      alert('Evaluation deleted successfully!');
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesInternship = selectedInternshipFilter === 'all' || 
                             String(app.internshipId) === String(selectedInternshipFilter);
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesSearch = app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (app.education && app.education.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesInternship && matchesStatus && matchesSearch;
  });

  const filteredInterns = interns.filter(intern => {
    const matchesStatus = statusFilter === 'all' || intern.status === statusFilter;
    const matchesSearch = intern.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         intern.internshipTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const getStatusCounts = (items, statusField = 'status') => {
    return items.reduce((counts, item) => {
      const status = item[statusField] || 'Pending';
      counts[status] = (counts[status] || 0) + 1;
      return counts;
    }, {});
  };

  const applicationStatusCounts = getStatusCounts(applications);
  const internStatusCounts = getStatusCounts(interns);

  return (
    <div className="applications-management">
      <header className="applications-header">
        <h1>Applications & Interns Management</h1>
        <button onClick={() => navigate('/company-dashboard')} className="back-btn">
          Back to Dashboard
        </button>
      </header>

      <div className="tabs-container">
        <div className="tabs">
          <button 
            className={`tab ${!selectedIntern ? 'active' : ''}`}
            onClick={() => {
              setSelectedIntern(null);
              setSelectedApplication(null);
              setStatusFilter('all');
            }}
          >
            Applications
            <span className="count">({applications.length})</span>
          </button>
          
          <button 
            className={`tab ${selectedIntern ? 'active' : ''}`}
            onClick={() => {
              setSelectedApplication(null);
              setSelectedIntern(null);
              setStatusFilter('all');
            }}
          >
            Interns
            <span className="count">({interns.length})</span>
          </button>
        </div>

        <div className="controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name, education, or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <i className="search-icon">🔍</i>
          </div>
          
          <div className="filters">
            {!selectedIntern && (
              <div className="filter">
                <label>Internship:</label>
                <select 
                  value={selectedInternshipFilter}
                  onChange={(e) => setSelectedInternshipFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Internships</option>
                  {internships.map(internship => (
                    <option key={internship.id} value={internship.id}>
                      {internship.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="filter">
              <label>Status:</label>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Statuses</option>
                {!selectedIntern ? (
                  <>
                    <option value="Pending">Pending</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Finalized">Finalized</option>
                    <option value="Current Intern">Current Intern</option>
                  </>
                ) : (
                  <>
                    <option value="Current Intern">Current Intern</option>
                    <option value="Internship Complete">Internship Complete</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>

        <div className="status-summary">
          {!selectedIntern ? (
            <>
              <div className="status-chip all">
                All: {applications.length}
              </div>
              <div className="status-chip pending">
                Pending: {applicationStatusCounts['Pending'] || 0}
              </div>
              <div className="status-chip accepted">
                Accepted: {applicationStatusCounts['Accepted'] || 0}
              </div>
              <div className="status-chip finalized">
                Finalized: {applicationStatusCounts['Finalized'] || 0}
              </div>
              <div className="status-chip rejected">
                Rejected: {applicationStatusCounts['Rejected'] || 0}
              </div>
              <div className="status-chip current">
                Current Interns: {applicationStatusCounts['Current Intern'] || 0}
              </div>
            </>
          ) : (
            <>
              <div className="status-chip all">
                All Interns: {interns.length}
              </div>
              <div className="status-chip current">
                Current: {internStatusCounts['Current Intern'] || 0}
              </div>
              <div className="status-chip completed">
                Completed: {internStatusCounts['Internship Complete'] || 0}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="content-area">
        <div className="list-container">
          {!selectedIntern ? (
            <>
              <h2>Internship Applications</h2>
              {filteredApplications.length > 0 ? (
                <div className="applications-list">
                  {filteredApplications.map((application) => (
                    <div 
                      key={application.id} 
                      className={`application-item ${selectedApplication?.id === application.id ? 'selected' : ''}`}
                      onClick={() => handleViewApplicationDetails(application)}
                    >
                      <div className="application-header">
                        <h3>{application.fullName}</h3>
                        <span className={`status-badge ${application.status?.toLowerCase() || 'pending'}`}>
                          {application.status || 'Pending'}
                        </span>
                      </div>
                      <div className="application-meta">
                        <p><strong>Internship:</strong> {getInternshipTitle(application.internshipId)}</p>
                        <p><strong>Education:</strong> {application.education || 'Not specified'}</p>
                        <p><strong>Applied on:</strong> {new Date(application.submittedDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>
                    {applications.length === 0 
                      ? 'No applications have been received for any internships.'
                      : 'No applications match the current filters. Try adjusting the internship or status filters.'}
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              <h2>Company Interns</h2>
              {filteredInterns.length > 0 ? (
                <div className="interns-list">
                  {filteredInterns.map((intern) => (
                    <div 
                      key={intern.id} 
                      className={`intern-item ${selectedIntern?.id === intern.id ? 'selected' : ''}`}
                      onClick={() => handleViewInternDetails(intern)}
                    >
                      <div className="intern-header">
                        <h3>{intern.name}</h3>
                        <span className={`status-badge ${intern.status?.toLowerCase() || 'current-intern'}`}>
                          {intern.status || 'Current Intern'}
                        </span>
                      </div>
                      <div className="intern-meta">
                        <p><strong>Position:</strong> {intern.internshipTitle}</p>
                        <p><strong>Started:</strong> {new Date(intern.startDate).toLocaleDateString()}</p>
                        {intern.completionDate && (
                          <p><strong>Completed:</strong> {new Date(intern.completionDate).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No interns found. {searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters.' : ''}</p>
                </div>
              )}
            </>
          )}
        </div>

        <div className={`details-panel ${selectedApplication || selectedIntern ? 'active' : ''}`}>
          {selectedApplication && (
            <div className="application-details">
              <div className="details-header">
                <h2>Application Details</h2>
                <button className="close-btn" onClick={handleCloseDetails}>×</button>
              </div>
              <div className="details-content">
                <div className="applicant-info">
                  <h3>{selectedApplication.fullName}</h3>
                  <p className="status"><strong>Status:</strong> 
                    <span className={`status-badge ${selectedApplication.status?.toLowerCase() || 'pending'}`}>
                      {selectedApplication.status || 'Pending'}
                    </span>
                  </p>
                  <div className="info-group">
                    <h4>Personal Information</h4>
                    <p><strong>Email:</strong> {selectedApplication.email}</p>
                    <p><strong>Phone:</strong> {selectedApplication.phone || 'Not provided'}</p>
                    <p><strong>Education:</strong> {selectedApplication.education || 'Not specified'}</p>
                    <p><strong>Experience:</strong> {selectedApplication.experience || 'Not specified'}</p>
                    <p><strong>Applied for:</strong> {getInternshipTitle(selectedApplication.internshipId)}</p>
                    <p><strong>Applied on:</strong> {new Date(selectedApplication.submittedDate).toLocaleDateString()}</p>
                  </div>
                  {selectedApplication.coverLetter && (
                    <div className="info-group">
                      <h4>Cover Letter</h4>
                      <div className="cover-letter">
                        {selectedApplication.coverLetter}
                      </div>
                    </div>
                  )}
                  {selectedApplication.resumeFileName && (
                    <div className="info-group">
                      <h4>Resume</h4>
                      <p><strong>File:</strong> {selectedApplication.resumeFileName}</p>
                    </div>
                  )}
                  <div className="info-group">
                    <h4>Actions</h4>
                    <div className="action-buttons">
                      {selectedApplication.status !== 'Accepted' && selectedApplication.status !== 'Current Intern' && (
                        <button 
                          className="action-btn accept"
                          onClick={() => handleUpdateApplicationStatus(selectedApplication, 'Accepted')}
                        >
                          Accept
                        </button>
                      )}
                      {selectedApplication.status !== 'Finalized' && selectedApplication.status !== 'Current Intern' && (
                        <button 
                          className="action-btn finalize"
                          onClick={() => handleUpdateApplicationStatus(selectedApplication, 'Finalized')}
                        >
                          Finalize
                        </button>
                      )}
                      {selectedApplication.status !== 'Rejected' && selectedApplication.status !== 'Current Intern' && (
                        <button 
                          className="action-btn reject"
                          onClick={() => handleUpdateApplicationStatus(selectedApplication, 'Rejected')}
                        >
                          Reject
                        </button>
                      )}
                      {(selectedApplication.status === 'Accepted' || selectedApplication.status === 'Finalized') && (
                        <button 
                          className="action-btn start"
                          onClick={() => handleUpdateApplicationStatus(selectedApplication, 'Current Intern')}
                        >
                          Start Internship
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {selectedIntern && (
            <div className="intern-details">
              <div className="details-header">
                <h2>Intern Details</h2>
                <button className="close-btn" onClick={handleCloseDetails}>×</button>
              </div>
              <div className="details-content">
                <div className="intern-info">
                  <h3>{selectedIntern.name}</h3>
                  <p className="status"><strong>Status:</strong> 
                    <span className={`status-badge ${selectedIntern.status?.toLowerCase() || 'current-intern'}`}>
                      {selectedIntern.status || 'Current Intern'}
                    </span>
                  </p>
                  <div className="info-group">
                    <h4>Internship Information</h4>
                    <p><strong>Position:</strong> {selectedIntern.internshipTitle}</p>
                    <p><strong>Email:</strong> {selectedIntern.email}</p>
                    <p><strong>Phone:</strong> {selectedIntern.phone || 'Not provided'}</p>
                    <p><strong>Start Date:</strong> {new Date(selectedIntern.startDate).toLocaleDateString()}</p>
                    {selectedIntern.completionDate && (
                      <p><strong>Completion Date:</strong> {new Date(selectedIntern.completionDate).toLocaleDateString()}</p>
                    )}
                  </div>
                  <div className="info-group">
                    <h4>Actions</h4>
                    <div className="action-buttons">
                      {selectedIntern.status === 'Current Intern' && (
                        <button 
                          className="action-btn complete"
                          onClick={() => handleUpdateInternStatus(selectedIntern, 'Internship Complete')}
                        >
                          Complete Internship
                        </button>
                      )}
                      {selectedIntern.status === 'Internship Complete' && !showEvaluationForm && (
                        <button 
                          className="action-btn evaluate"
                          onClick={() => setShowEvaluationForm(true)}
                        >
                          {evaluationForm.overallPerformance ? 'Edit Evaluation' : 'Create Evaluation'}
                        </button>
                      )}
                    </div>
                  </div>
                  {showEvaluationForm && selectedIntern.status === 'Internship Complete' && (
                    <div className="evaluation-form">
                      <h4>Intern Evaluation</h4>
                      <p className="note">Note: This evaluation will only be visible to the SCAD office.</p>
                      <form onSubmit={handleSubmitEvaluation}>
                        <div className="form-group">
                          <label>Technical Skills</label>
                          <select 
                            name="technicalSkills" 
                            value={evaluationForm.technicalSkills} 
                            onChange={handleEvaluationChange}
                            required
                          >
                            <option value="">Select Rating</option>
                            <option value="Poor">Poor</option>
                            <option value="Below Average">Below Average</option>
                            <option value="Average">Average</option>
                            <option value="Good">Good</option>
                            <option value="Excellent">Excellent</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Communication Skills</label>
                          <select 
                            name="communicationSkills" 
                            value={evaluationForm.communicationSkills} 
                            onChange={handleEvaluationChange}
                            required
                          >
                            <option value="">Select Rating</option>
                            <option value="Poor">Poor</option>
                            <option value="Below Average">Below Average</option>
                            <option value="Average">Average</option>
                            <option value="Good">Good</option>
                            <option value="Excellent">Excellent</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Teamwork</label>
                          <select 
                            name="teamwork" 
                            value={evaluationForm.teamwork} 
                            onChange={handleEvaluationChange}
                            required
                          >
                            <option value="">Select Rating</option>
                            <option value="Poor">Poor</option>
                            <option value="Below Average">Below Average</option>
                            <option value="Average">Average</option>
                            <option value="Good">Good</option>
                            <option value="Excellent">Excellent</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Punctuality</label>
                          <select 
                            name="punctuality" 
                            value={evaluationForm.punctuality} 
                            onChange={handleEvaluationChange}
                            required
                          >
                            <option value="">Select Rating</option>
                            <option value="Poor">Poor</option>
                            <option value="Below Average">Below Average</option>
                            <option value="Average">Average</option>
                            <option value="Good">Good</option>
                            <option value="Excellent">Excellent</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Overall Performance</label>
                          <select 
                            name="overallPerformance" 
                            value={evaluationForm.overallPerformance} 
                            onChange={handleEvaluationChange}
                            required
                          >
                            <option value="">Select Rating</option>
                            <option value="Poor">Poor</option>
                            <option value="Below Average">Below Average</option>
                            <option value="Average">Average</option>
                            <option value="Good">Good</option>
                            <option value="Excellent">Excellent</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Comments</label>
                          <textarea 
                            name="comments" 
                            value={evaluationForm.comments} 
                            onChange={handleEvaluationChange}
                            rows={4}
                            required
                          ></textarea>
                        </div>
                        <div className="form-group checkbox">
                          <input 
                            type="checkbox" 
                            id="recommendForHire"
                            name="recommendForHire" 
                            checked={evaluationForm.recommendForHire} 
                            onChange={handleEvaluationChange}
                          />
                          <label htmlFor="recommendForHire">Would recommend for hire</label>
                        </div>
                        <div className="form-actions">
                          <button type="submit" className="submit-btn">
                            {evaluationForm.overallPerformance ? 'Update Evaluation' : 'Submit Evaluation'}
                          </button>
                          <button 
                            type="button" 
                            className="cancel-btn"
                            onClick={() => setShowEvaluationForm(false)}
                          >
                            Cancel
                          </button>
                          {evaluationForm.overallPerformance && (
                            <button 
                              type="button" 
                              className="delete-btn"
                              onClick={handleDeleteEvaluation}
                            >
                              Delete Evaluation
                            </button>
                          )}
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationsManagement;