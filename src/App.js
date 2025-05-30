import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import CompanyDashboard from './pages/CompanyDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ProStudentDashboard from './pages/ProStudentDashboard';
import ScadDashboard from './pages/ScadDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import InternshipPost from './pages/InternshipPost';
import EditInternship from './pages/EditInternship';       
import InternshipDetails from './components/InternshipDetails';
import CompanyDetails from './components/CompanyDetails';
import ScadInternships from './components/InternshipsList';
import StudentList from './pages/StudentList';
import StudentProfilePage from './pages/StudentProfilePage';
import SubmittedReportsPage from './pages/SubmittedReports';
import ReportDetailsPage from './pages/ReportDetails';
import EvaluationReportDetails from './pages/EvaluationReportDetails';
import PrivateRoute from './components/PrivateRoute';
import Unauthorized from './pages/Unauthorized';
import ApplicationsManagement from './pages/ApplicationsManagement';   
import EditProfile from './pages/EditProfile';
import Assessments from './pages/Assessments';
import MyInternships from './pages/MyInternships';
import ReportEditor from './pages/ReportEditor';
import ReportViewer from './pages/ReportViewer';
import EditProfileStudent from './pages/EditProfileStudent';
import EvaluationManagement from './pages/EvaluationManagement'; // Import EvaluationManagement
import ReportManagement from './pages/ReportManagement'; // Import ReportManagement
import InternshipDetailsStudent from './pages/InternshipDetailsStudent';
import ReportsStudent from './pages/reportsStudent';
import DummyDetailsForCompany from './pages/DummyDetailsForCompany';
import StudentEvaluationsView from './pages/StudentEvaluationsView';
import ViewApplications from './pages/ViewApplications';
import CompanyEvaluationForm from './pages/CompanyEvaluationForm';
import StudentEvaluationForm from './pages/StudentEvaluationForm';
import MyApplications from './pages/MyApplications';
import EvaluationViewer from './pages/EvaluationViewer';
import Workshops from './pages/Workshops';
import AppointmentSystem from './pages/AppointmentSystem';
import CareerWorkshops from './pages/CareerWorkshops';
import './styles/Login.css';
import './styles/ReportList.css';
import CoursesManagement from "./pages/CoursesManagement";
import UploadDocument from "./pages/UploadDocument";
import InternshipVideo from "./pages/InternshipVideo";
import InternshipListPro from "./pages/InternshipListPro";
import InternshipInsightsReport from "./components/InternshipInsightsReport";
import VideoCallAppointmentSystem from "./pages/VideoCallAppointmentSystem";
import CompanyDetailsPro from "./pages/CompanyDetailsPro";
import EvaluationReportDetailsFaculty from "./pages/EvaluationReportDetailsFaculty";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/internship-details/:id" element={<InternshipDetails />} />
        <Route path="/company-details/:id" element={<CompanyDetails />} />

        {/* Company Routes */}
        <Route element={<PrivateRoute allowedRoles={['company']} />}>
          <Route path="/company-dashboard" element={<CompanyDashboard />} />
          <Route path="/create-internship" element={<InternshipPost />} />
          <Route path="/edit-internship/:id" element={<EditInternship />} />
          <Route path="/view-applications/:internshipId?" element={<ViewApplications />} />
          <Route path="/company-view-student/:studentId" element={<DummyDetailsForCompany />} />
          <Route path="/evaluation-form" element={<CompanyEvaluationForm />} />
          <Route path="/scad-evaluations" element={<StudentEvaluationsView />} />
        </Route>

        {/* Student Routes */}
        <Route element={<PrivateRoute allowedRoles={['student']} />}>
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/edit-profile-student" element={<EditProfileStudent />} />
          <Route path="/internship/:id/evaluation" element={<EvaluationManagement />} />
          <Route path="/internship/:id/report" element={<ReportManagement />} />
          <Route path="/internship-details-student/:id" element={<InternshipDetailsStudent />} />
          <Route path="/reportsStudent" element={<ReportsStudent />} />
          <Route path="/manage-courses" element={<CoursesManagement />} />
          <Route path="/UploadDocument" element={<UploadDocument />} />
          <Route path="/InternshipVideo" element={<InternshipVideo />} />
        </Route>

        {/* Pro-Student Routes */}
        <Route element={<PrivateRoute allowedRoles={['pro-student']} />}>
          <Route path="/pro-student-dashboard" element={<ProStudentDashboard />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/assessments" element={<Assessments />} />
          <Route path="/my-internships" element={<MyInternships />} />
          <Route path="/my-applications" element={<MyApplications />} />
          <Route path="/evaluate-internship" element={<StudentEvaluationForm />} />
          <Route path="/my-reports" element={<ReportEditor />} />
          <Route path="/view-report" element={<ReportViewer />} />
          <Route path="/internships" element={<InternshipListPro />} /> 
          <Route path="/schedule-session" element={<AppointmentSystem />} />
          <Route path="/internship/:internshipId/evaluation2" element={<StudentEvaluationForm />} />
          <Route path="/internship/:internshipId/reportPro" element={<ReportEditor />} />
          <Route path="/report-details/:reportId" element={<ReportDetailsPage />} />
          <Route path="/workshops" element={<Workshops />} />
          <Route path="/company-details-pro/:id" element={<CompanyDetailsPro />} /> 
        </Route>

        {/* Private Routes for SCAD */}
        <Route element={<PrivateRoute allowedRoles={['scad']} />}>
          <Route path="/scad-dashboard" element={<ScadDashboard />} />
          <Route path="/internships-list" element={<ScadInternships />} />
          <Route path="/students" element={<StudentList />} />
          <Route path="/students/:studentId" element={<StudentProfilePage />} />
          <Route path="/career-workshops" element={<CareerWorkshops />} />
          <Route path="/submitted-reports" element={<SubmittedReportsPage />} />
          <Route path="/submitted-reports/:reportId" element={<ReportDetailsPage />} />
          <Route path="/evaluation-report/:id" element={<EvaluationReportDetails />} />
          <Route path="/internship-insights-report" element={<InternshipInsightsReport />} />
          <Route path="/video-call-dashboard" element={<VideoCallAppointmentSystem />} />
          <Route path="/video-call-dashboard" element={<Navigate to="/video-call-dashboard/appointments" replace />} />
          <Route path="/video-call-dashboard/appointments" element={<VideoCallAppointmentSystem initialTab="appointments" />} />
          <Route path="/video-call-dashboard/video-calls" element={<VideoCallAppointmentSystem initialTab="video-calls" />} />
          <Route path="/video-call-dashboard/incoming-calls" element={<VideoCallAppointmentSystem initialTab="incoming-calls" />} />
        </Route>
        
        {/* Faculty Routes */}
        <Route element={<PrivateRoute allowedRoles={['faculty']} />}>
          <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
          <Route path="/faculty-evaluation-report/:id" element={<EvaluationReportDetailsFaculty variant="faculty" />} />
        </Route>

        {/* Catch-all Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;