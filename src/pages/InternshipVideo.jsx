import React from "react";

const InternshipVideo = ({ major }) => {
  // Video URLs mapped by major
  const videoUrls = {
    "Computer Science": "https://www.youtube.com/embed/gE7Jc-Oztu0", 
    "Mechanical Engineering": "https://www.youtube.com/embed/gE7Jc-Oztu0",
    "Business Administration": "https://www.youtube.com/embed/gE7Jc-Oztu0",
    "Civil Engineering": "https://www.youtube.com/embed/gE7Jc-Oztu0",
    "Design": "https://www.youtube.com/embed/gE7Jc-Oztu0",
  };

  // Get the video URL for the given major
  const videoUrl = videoUrls[major] || "";

  return (
    <div className="internship-video-container">
      <h2>What Internships Count for {major}?</h2>
      {videoUrl ? (
        <iframe
          width="560"
          height="315"
          src={videoUrl}
          title={`Internship Information for ${major}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <p>No video available for your major at the moment.</p>
      )}
    </div>
  );
};

export default InternshipVideo;