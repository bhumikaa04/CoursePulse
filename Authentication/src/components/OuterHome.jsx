import React from 'react';
import '../styles/outerHome.css'; // Importing the new CSS file

const OuterHome = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to CoursePulse</h1>
          <p>Create, Learn, and Share Your Knowledge</p>
          <div className="cta-buttons">
            <button className="primary-btn">Create a Course</button>
            <button className="secondary-btn">Explore Courses</button>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="featured-courses">
        <h2>Featured Courses</h2>
        <div className="courses-grid">
          <div className="course-item">
            <h3>Web Development 101</h3>
            <p>Learn the basics of web development.Find content from .</p>
            <button className="course-btn">View Course</button>
          </div>
          <div className="course-item">
            <h3>Graphic Design Basics</h3>
            <p>Master the fundamentals of graphic design.</p>
            <button className="course-btn">View Course</button>
          </div>
          <div className="course-item">
            <h3>Data Science for Beginners</h3>
            <p>Understand the fundamentals of data science.</p>
            <button className="course-btn">View Course</button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-icon">🔍</div>
            <h3>Search</h3>
            <p>Find content from across the web. Find content from across the web.</p>
          </div>
          <div className="step">
            <div className="step-icon">✏️</div>
            <h3>Create</h3>
            <p>Build your course with videos, articles, and podcasts.</p>
          </div>
          <div className="step">
            <div className="step-icon">📢</div>
            <h3>Share</h3>
            <p>Publish and share your course with the world.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OuterHome;