import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../styles/searchComponent.css'; // Import your CSS styles

const SearchComponent = () => {
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filter state
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  
  // Autocomplete state
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef(null);

  // Available filters (could be fetched from API)
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'web', label: 'Web Development' },
    { value: 'design', label: 'Design' },
    { value: 'business', label: 'Business' },
    { value: 'data', label: 'Data Science' },
  ];

  const difficulties = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  // Debounce search query
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchQuery]);

  // Fetch autocomplete suggestions
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const response = await axios.get(`/api/courses/suggestions?q=${debouncedQuery}`);
        setSuggestions(response.data);
      } catch (err) {
        console.error('Failed to fetch suggestions:', err);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  // Fetch search results with filters
  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const params = {
          q: debouncedQuery,
          category: categoryFilter !== 'all' ? categoryFilter : undefined,
          difficulty: difficultyFilter !== 'all' ? difficultyFilter : undefined,
        };

        const response = await axios.get('/api/courses/search', { params });
        setSearchResults(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery, categoryFilter, difficultyFilter]);

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    searchInputRef.current.focus();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setError(null);
    searchInputRef.current.focus();
  };

  return (
    <div className="search-container">
      <div className="search-header">
        <h2>Find Courses</h2>
        <p>Search from thousands of courses across the web</p>
      </div>

      <div className="search-controls">
        <div className="search-box">
          <div className="search-input-container">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search courses by title, instructor, or topic..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="search-input"
            />
            {searchQuery && (
              <button className="clear-button" onClick={handleClearSearch}>
                &times;
              </button>
            )}
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="suggestion-item"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="search-filters">
          <div className="filter-group">
            <label htmlFor="category-filter">Category:</label>
            <select
              id="category-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="difficulty-filter">Difficulty:</label>
            <select
              id="difficulty-filter"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
            >
              {difficulties.map((difficulty) => (
                <option key={difficulty.value} value={difficulty.value}>
                  {difficulty.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="search-status">
        {isLoading && <div className="loading-indicator">Searching...</div>}
        {error && <div className="error-message">{error}</div>}
        {!isLoading && !error && debouncedQuery && (
          <div className="results-count">
            Found {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
          </div>
        )}
      </div>

      <div className="search-results">
        {searchResults.length > 0 ? (
          searchResults.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))
        ) : (
          debouncedQuery &&
          !isLoading && (
            <div className="no-results">
              No courses found matching "{debouncedQuery}"
              {categoryFilter !== 'all' && ` in category ${categoryFilter}`}
              {difficultyFilter !== 'all' && ` at ${difficultyFilter} level`}
            </div>
          )
        )}
      </div>
    </div>
  );
};

const CourseCard = ({ course }) => (
  <div className="course-card">
    <div className="course-image">
      <img src={course.imageUrl || '/default-course.jpg'} alt={course.title} />
    </div>
    <div className="course-details">
      <h3>{course.title}</h3>
      <p className="instructor">By {course.instructor}</p>
      <p className="description">{course.description}</p>
      <div className="course-meta">
        <span className={`category ${course.category}`}>{course.category}</span>
        <span className={`difficulty ${course.difficulty}`}>
          {course.difficulty}
        </span>
        <span className="rating">
          {course.rating} ★ ({course.reviews} reviews)
        </span>
      </div>
    </div>
  </div>
);

export default SearchComponent;