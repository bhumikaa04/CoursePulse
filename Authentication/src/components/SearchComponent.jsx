import React, { useState, useEffect, useRef } from "react";
import "../styles/SearchComponent.css";
import { Link } from "react-router-dom";

const SearchComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ courses: [], profiles: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchInputRef = useRef(null);

  // Debounce the search query to reduce API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch search results when the debounced query changes
  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery) {
        setSearchResults({ courses: [], profiles: [] });
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:3001/search?q=${encodeURIComponent(debouncedQuery)}`);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setSearchResults(data);
      } catch (err) {
        console.error("Search fetch error:", err.message);
        setError(err.message || "An error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults({ courses: [], profiles: [] });
    setError(null);
    searchInputRef.current.focus();
  };

  return (
    <div className="search-container">
      <div className="search-header">
        <h2>Search Our Platform</h2>
        <p>Find courses or user profiles with ease.</p>
      </div>

      <div className="search-box">
        <SearchInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleClearSearch={handleClearSearch}
          inputRef={searchInputRef}
        />
      </div>

      <div className="search-status">
        {isLoading && <p className="loading-indicator">Loading results...</p>}
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button className="retry-button" onClick={() => setDebouncedQuery(searchQuery)}>
              Retry
            </button>
          </div>
        )}
        {!isLoading && !error && debouncedQuery && (
          <p className="results-count">
            Found {searchResults.courses.length + searchResults.profiles.length} results
          </p>
        )}
      </div>

      <div className="search-results">
        {searchResults.profiles.length > 0 && (
          <Section title="Profiles">
            <CardsList
              items={searchResults.profiles}
              renderItem={(profile) => <ProfileCard key={profile.username || profile._id} profile={profile} />}
            />
          </Section>
        )}
        {searchResults.courses.length > 0 && (
          <Section title="Courses">
            <CardsList
              items={searchResults.courses}
              renderItem={(course) => <CourseCard key={course.id || course._id} course={course} />}
            />
          </Section>
        )}
        {!isLoading &&
          !error &&
          debouncedQuery &&
          searchResults.courses.length === 0 &&
          searchResults.profiles.length === 0 && (
            <div className="no-results">
              No results found for "{debouncedQuery}"
            </div>
          )}
      </div>
    </div>
  );
};

const SearchInput = ({ searchQuery, setSearchQuery, handleClearSearch, inputRef }) => (
  <div className="search-input-container">
    <input
      ref={inputRef}
      type="text"
      placeholder="Search for courses or profiles..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="search-input"
    />
    {searchQuery && (
      <button className="clear-button" onClick={handleClearSearch}>
        &times;
      </button>
    )}
  </div>
);

const Section = ({ title, children }) => (
  <div className="section">
    <h3>{title}</h3>
    {children}
  </div>
);

const CardsList = ({ items, renderItem }) => (
  <div className="cards-container">
    {items.map(renderItem)}
  </div>
);

const ProfileCard = ({ profile }) => (
  <div className="card profile-card">
    <div className="card-content">
      {/* Image and Name Section */}
      <div className="profile-header">
        <img
          src={profile.profilePhoto || "default-profile.png"} // Fallback to a default image
          alt={`${profile.name}'s profile`}
          className="profile-image"
        />
        <div className="profile-info">
          <h4>{profile.name || "Unknown Name"}</h4>
          <p>@{profile.ownerEmail || "Unknown Email"}</p>
        </div>
      </div>

      {/* Button Section */}
      <div className="profile-button">
        <Link to={`/profile/${profile.username || profile._id}`} className="button-link">
          Go to Profile
        </Link>
      </div>
    </div>
  </div>
);

const CourseCard = ({ course }) => (
  <div className="card course-card">
    <div className="card-content">
      <h4>{course.title || "Untitled Course"}</h4>
      <p>{course.description || "No description available."}</p>
      <span>By {course.instructor || "Unknown Instructor"}</span>
    </div>
  </div>
);

export default SearchComponent;
