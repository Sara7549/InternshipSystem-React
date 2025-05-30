import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaCalendarAlt, 
  FaClock, 
  FaUserFriends, 
  FaEdit, 
  FaTrash, 
  FaPlus, 
  FaTimes,
  FaChartBar,
  FaUserGraduate,
  FaVideo,
  FaBriefcase,
  FaFileAlt,
  FaChalkboardTeacher,
  FaBars
} from 'react-icons/fa';
import '../styles/CareerWorkshops.css';

const CareerWorkshops = () => {
  const [workshops, setWorkshops] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [currentWorkshop, setCurrentWorkshop] = useState(null);
  const [isOpen, setIsOpen] = useState(true); // Sidebar state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    presenter: '',
    presenterBio: '',
    capacity: 50,
    category: 'resume',
    agenda: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    // For debugging - log to console what workshops are loaded
    console.log("Loading workshops from localStorage");
    
    const savedWorkshops = localStorage.getItem('workshops');
    
    if (savedWorkshops) {
      const parsedWorkshops = JSON.parse(savedWorkshops);
      console.log("Workshops found in localStorage:", parsedWorkshops);
      setWorkshops(parsedWorkshops);
    } else {
      const mockWorkshops = [
        {
          id: 1,
          title: 'Resume Building for Tech Industry',
          description: 'Learn how to create a standout resume for technology sector jobs.',
          date: '2023-07-10',
          startTime: '14:00',
          endTime: '16:00',
          time: '14:00 - 16:00',
          presenter: 'Jane Smith',
          presenterBio: 'HR Manager at Tech Solutions with 10+ years of recruiting experience',
          capacity: 50,
          registeredCount: 35,
          category: 'resume',
          agenda: '- Introduction to tech resumes\n- Key sections to include\n- Common mistakes to avoid\n- ATS optimization\n- Q&A session'
        },
        {
          id: 2,
          title: 'Interview Skills for Creative Roles',
          description: 'Practical tips for acing interviews in creative industries.',
          date: '2023-07-15',
          startTime: '10:00',
          endTime: '12:00',
          time: '10:00 - 12:00',
          presenter: 'Michael Johnson',
          presenterBio: 'Creative Director with experience hiring at top design agencies',
          capacity: 30,
          registeredCount: 28,
          category: 'interview',
          agenda: '- Creative interview formats\n- Portfolio presentation tips\n- Answering conceptual questions\n- Practical exercises\n- Follow-up strategies'
        },
        {
          id: 3,
          title: 'LinkedIn Profile Optimization',
          description: 'How to make your LinkedIn profile stand out to recruiters.',
          date: '2023-07-20',
          startTime: '15:00',
          endTime: '16:30',
          time: '15:00 - 16:30',
          presenter: 'Sarah Thompson',
          presenterBio: 'Career Coach specializing in digital presence for professionals',
          capacity: 100,
          registeredCount: 65,
          category: 'networking',
          agenda: '- Profile photo selection\n- Headline and summary writing\n- Experience highlighting strategies\n- Skills endorsements\n- Networking best practices'
        },
        {
          id: 4,
          title: 'Mastering Technical Interviews',
          description: 'Prepare for coding interviews with mock problems and strategy tips.',
          date: '2023-07-27',
          startTime: '13:00',
          endTime: '15:00',
          time: '13:00 - 15:00',
          presenter: 'David Lee',
          presenterBio: 'Senior Software Engineer at Google, specializing in interview coaching',
          capacity: 40,
          registeredCount: 32,
          category: 'interview',
          agenda: '- Understanding interview formats\n- Solving algorithm problems\n- Behavioral questions\n- System design basics\n- Live mock interview demo'
        },
        {
          id: 5,
          title: 'Personal Branding for Students',
          description: 'Learn to craft a unique personal brand that stands out to employers.',
          date: '2023-08-02',
          startTime: '11:00',
          endTime: '13:00',
          time: '11:00 - 13:00',
          presenter: 'Nina Alvarez',
          presenterBio: 'Marketing Strategist and personal branding consultant',
          capacity: 60,
          registeredCount: 45,
          category: 'branding',
          agenda: '- Defining your brand\n- Crafting a personal story\n- Consistent branding across platforms\n- Visual identity tips\n- Case studies and feedback'
        },
        {
          id: 6,
          title: 'Networking 101: Making Meaningful Connections',
          description: 'Develop networking skills to grow your professional relationships.',
          date: '2023-08-08',
          startTime: '16:00',
          endTime: '17:30',
          time: '16:00 - 17:30',
          presenter: 'Kevin Brooks',
          presenterBio: 'Business Consultant and professional networking coach',
          capacity: 80,
          registeredCount: 50,
          category: 'networking',
          agenda: '- Elevator pitch creation\n- Online and in-person networking\n- Follow-up etiquette\n- LinkedIn and email outreach\n- Role-playing exercises'
        }
      ];
      
      console.log("No workshops found, using mock data:", mockWorkshops);
      setWorkshops(mockWorkshops);
      localStorage.setItem('workshops', JSON.stringify(mockWorkshops));
    }
  }, []);
  
  // Force a re-render when filter changes
  useEffect(() => {
    console.log("Filter changed to:", filter);
    // This empty effect ensures re-rendering when filter changes
  }, [filter]);
  
  const saveWorkshops = (updatedWorkshops) => {
    console.log("Saving workshops:", updatedWorkshops);
    localStorage.setItem('workshops', JSON.stringify(updatedWorkshops));
    setWorkshops(updatedWorkshops);
  };
  
  // Get filtered workshops
  const filteredWorkshops = React.useMemo(() => {
    console.log("All workshops:", workshops);
    let filtered = filter === 'all' 
      ? workshops 
      : workshops.filter(w => w.category === filter);
    console.log("Filtered workshops:", filtered);
    return filtered;
  }, [workshops, filter]);
  
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      startTime: '',
      endTime: '',
      presenter: '',
      presenterBio: '',
      capacity: 50,
      category: 'resume',
      agenda: ''
    });
    setCurrentWorkshop(null);
  };
  
  const openForm = (workshop = null) => {
    if (workshop) {
      setFormData({
        title: workshop.title,
        description: workshop.description,
        date: workshop.date,
        startTime: workshop.startTime,
        endTime: workshop.endTime,
        presenter: workshop.presenter,
        presenterBio: workshop.presenterBio || '',
        capacity: workshop.capacity,
        category: workshop.category,
        agenda: workshop.agenda || ''
      });
      setCurrentWorkshop(workshop);
    } else {
      resetForm();
    }
    setShowForm(true);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const workshopData = {
      ...formData,
      time: `${formData.startTime} - ${formData.endTime}`,
      registeredCount: currentWorkshop ? currentWorkshop.registeredCount : 0
    };
    
    if (currentWorkshop) {
      const updatedWorkshops = workshops.map(w => 
        w.id === currentWorkshop.id ? { ...workshopData, id: currentWorkshop.id } : w
      );
      saveWorkshops(updatedWorkshops);
    } else {
      const newId = workshops.length > 0 ? Math.max(...workshops.map(w => w.id)) + 1 : 1;
      const newWorkshop = {
        ...workshopData,
        id: newId,
        registrationLink: `https://workshop-registration.com/${formData.title.toLowerCase().replace(/\s/g, '-')}`
      };
      saveWorkshops([...workshops, newWorkshop]);
    }
    
    setShowForm(false);
    resetForm();
  };
  
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this workshop?')) {
      const updatedWorkshops = workshops.filter(workshop => workshop.id !== id);
      saveWorkshops(updatedWorkshops);
    }
  };
  
  const handleViewDetails = (workshop) => {
    setCurrentWorkshop(workshop);
    setShowDetails(true);
  };
  
  const handleBackToWorkshops = () => {
    setShowDetails(false);
    setCurrentWorkshop(null);
  };

  const onLogout = () => {
    // Handle logout functionality here
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
 
  return (
    <div className="admin-layout">
      
      
      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        {isOpen && (
          <nav className="sidebar-nav">
            <div className="sidebar-header"><h3>SCAD Admin</h3></div>
            <div className="sidebar-menu">
              <button onClick={() => navigate('/scad-dashboard')}><FaChartBar /> Dashboard</button>
              <button onClick={() => navigate('/students')}><FaUserGraduate /> Students</button>
              <button onClick={() => navigate('/video-call-dashboard')}><FaVideo /> Appointments</button>
              <button onClick={() => navigate('/internships-list')}><FaBriefcase /> Internships</button>
              <button onClick={() => navigate('/submitted-reports')}><FaFileAlt /> Reports</button>
              <button onClick={() => navigate('/career-workshops')} className="active"><FaChalkboardTeacher /> Workshops</button>
              <button onClick={() => navigate('/internship-insights-report')}><FaFileAlt /> Generate Reports</button>
              <div className="sidebar-divider"></div>
              <button onClick={onLogout} className="logout-btn">Logout</button>
            </div>
          </nav>
        )}
      </aside>

      {/* Main Content */}
      <div className={`main-content ${isOpen ? 'with-sidebar' : 'full-width'}`}>
        <div className="workshops-content">
          <header className="workshops-header">
            <div>
              <h1>Career Development Workshops</h1>
            </div>
            {!showDetails && (
              <button onClick={() => openForm()} className="add-workshop-btn">
                <FaPlus /> Add New Workshop
              </button>
            )}
          </header>

          {showDetails && currentWorkshop ? (
            <div className="workshop-details-container">
              <button onClick={handleBackToWorkshops} className="back-buttonn">
                <FaArrowLeft /> Back to Workshops
              </button>

              <h1>{currentWorkshop.title}</h1>
              <p className="workshop-description"><strong>Description:</strong> {currentWorkshop.description}</p>
              
              <div className="details-section">
                <p><FaCalendarAlt /> <strong>Date:</strong> {currentWorkshop.date}</p>
                <p><FaClock /> <strong>Time:</strong> {currentWorkshop.time}</p>
                <p><FaUserFriends /> <strong>Capacity:</strong> {currentWorkshop.capacity} participants</p>
                <p><strong>Currently registered:</strong> {currentWorkshop.registeredCount} participants</p>
                <p><strong>Category:</strong> {currentWorkshop.category}</p>
              </div>
              
              <div className="presenter-section">
                <h2>Presenter</h2>
                <p><strong>Name:</strong> {currentWorkshop.presenter}</p>
                <p><strong>Bio:</strong> {currentWorkshop.presenterBio || 'No bio available'}</p>
              </div>
              
              <h2>Workshop Agenda</h2>
              <div className="agenda-section">
                {currentWorkshop.agenda || 'No agenda available'}
              </div>
            </div>
          ) : (
            <>
              <div className="filter-section">
                <span>Filter by category: </span>
                <select 
                  value={filter} 
                  onChange={(e) => setFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Workshops</option>
                  <option value="resume">Resume Building</option>
                  <option value="interview">Interview Skills</option>
                  <option value="networking">Networking</option>
                  <option value="portfolio">Portfolio Development</option>
                  <option value="branding">Personal Branding</option>
                </select>
              </div>
              
              {/* Debug information */}
              
              
              <div className="workshops-grid">
                {filteredWorkshops.length > 0 ? (
                  filteredWorkshops.map(workshop => (
                    <div key={workshop.id} className="workshop-card">
                      <div className="card-actions">
                        <button onClick={() => openForm(workshop)} title="Edit workshop">
                          <FaEdit />
                        </button>
                        <button onClick={() => handleDelete(workshop.id)} title="Delete workshop">
                          <FaTrash />
                        </button>
                      </div>
                      
                      <h2>{workshop.title}</h2>
                      
                      <p className="card-description">{workshop.description}</p>
                      
                      <div className="card-details">
                        <p><FaCalendarAlt /> {workshop.date}</p>
                        <p><FaClock /> {workshop.time}</p>
                        <p><FaUserFriends /> {workshop.registeredCount}/{workshop.capacity} registered</p>
                      </div>
                      
                      <div className="card-footer">
                        <button onClick={() => handleViewDetails(workshop)}>
                          View Details
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-workshops-message">
                    No workshops available for this category.
                  </p>
                )}
              </div>
            </>
          )}
          
          {showForm && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>{currentWorkshop ? 'Edit Workshop' : 'Add New Workshop'}</h2>
                  <button onClick={() => setShowForm(false)}>
                    <FaTimes />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Workshop Title:</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Description:</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Date:</label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Start Time:</label>
                      <input
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>End Time:</label>
                      <input
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Presenter Name:</label>
                      <input
                        type="text"
                        name="presenter"
                        value={formData.presenter}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Category:</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="resume">Resume Building</option>
                        <option value="interview">Interview Skills</option>
                        <option value="networking">Networking</option>
                        <option value="portfolio">Portfolio Development</option>
                        <option value="branding">Personal Branding</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Presenter Bio:</label>
                    <textarea
                      name="presenterBio"
                      value={formData.presenterBio}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Capacity:</label>
                      <input
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleInputChange}
                        required
                        min="1"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Workshop Agenda:</label>
                    <textarea
                      name="agenda"
                      value={formData.agenda}
                      onChange={handleInputChange}
                      placeholder="Enter workshop agenda items, one per line"
                    />
                  </div>
                  
                  <div className="form-actions">
                    <button type="button" onClick={() => setShowForm(false)}>
                      Cancel
                    </button>
                    <button type="submit">
                      {currentWorkshop ? 'Update Workshop' : 'Add Workshop'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CareerWorkshops;