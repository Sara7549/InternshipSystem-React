import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import coursesByMajor from "./coursesByMajor";

const CoursesManagement = () => {
  const navigate = useNavigate();
  const [selectedMajor, setSelectedMajor] = useState(""); // Will be fetched from the profile
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);

  useEffect(() => {
    // Retrieve the selected major from localStorage (or profile data)
    const profile = JSON.parse(localStorage.getItem("profile")) || {};
    const major = profile.major || "";
    setSelectedMajor(major);

    // Fetch courses for the major
    if (major && coursesByMajor[major]) {
      setCourses(coursesByMajor[major]);
    }
    // Retrieve previously selected courses
    const savedCourses = JSON.parse(localStorage.getItem("selected_courses")) || [];
    setSelectedCourses(savedCourses);
  }, []);

  const handleCourseSelection = (course) => {
    const updatedCourses = selectedCourses.includes(course)
      ? selectedCourses.filter((c) => c !== course) // Remove if already selected
      : [...selectedCourses, course]; // Add if not selected

    setSelectedCourses(updatedCourses);
    localStorage.setItem("selected_courses", JSON.stringify(updatedCourses)); // Save to localStorage
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Manage Courses</h1>
        <button onClick={() => navigate("/student-dashboard")} className="back-btn">
          Back to Dashboard
        </button>
      </header>

      <main className="dashboard-main">
        <section className="dashboard-card full-width">
          <h2>Available Courses for {selectedMajor}</h2>
          {courses.length > 0 ? (
            <ul className="courses-list">
              {courses.map((course) => (
                <li key={course} className="course-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedCourses.includes(course)}
                      onChange={() => handleCourseSelection(course)}
                    />
                    {course}
                  </label>
                </li>
              ))}
            </ul>
          ) : (
            <p>No courses available for your major.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default CoursesManagement;