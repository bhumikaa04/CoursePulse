import React from "react";

export default function CourseForm({ courseDetails, setCourseDetails }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseDetails({ ...courseDetails, [name]: value });
  };

  return (
    <div style={{ marginBottom: "16px" }}>
      <input
        style={{ marginBottom: "8px", width: "100%", padding: "8px" }}
        type="text"
        name="title"
        placeholder="Course Title"
        value={courseDetails.title}
        onChange={handleChange}
      />
      <textarea
        style={{ marginBottom: "8px", width: "100%", padding: "8px" }}
        name="description"
        placeholder="Course Description"
        value={courseDetails.description}
        onChange={handleChange}
      />
      <input
        style={{ marginBottom: "8px", width: "100%", padding: "8px" }}
        type="text"
        name="duration"
        placeholder="Course Duration"
        value={courseDetails.duration}
        onChange={handleChange}
      />
      <input
        style={{ marginBottom: "8px", width: "100%", padding: "8px" }}
        type="text"
        name="level"
        placeholder="Course Level (e.g., Beginner, Intermediate)"
        value={courseDetails.level}
        onChange={handleChange}
      />
    </div>
  );
}
