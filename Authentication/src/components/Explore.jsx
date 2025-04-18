import React, { useState } from 'react'; 
import '../styles/explore.css'; // Importing the new CSS file

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality here
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="explore">
      <h1>Explore Courses</h1>
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="search-bar">
        <input
          type="text"
          placeholder="Search for courses or topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* Course List */}
      <div className="course-list">
        <div className="course-card">
          <h3>Web Development 101</h3>
          <p>Learn the basics of web development.</p>
          <button>View Course</button>
        </div>
        <div className="course-card">
          <h3>Graphic Design Basics</h3>
          <p>Master the fundamentals of graphic design.</p>
          <button>View Course</button>
        </div>
        <div className="course-card">
          <h3>Video Editing Masterclass</h3>
          <p>Become a pro at video editing.</p>
          <button>View Course</button>
        </div>
      </div>
    </div>
  );
};

export default Explore;