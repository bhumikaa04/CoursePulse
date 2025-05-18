import React from "react";

export default function CoursePreview({ courseDetails, contents }) {
  return (
    <div style={{ marginTop: "16px", border: "1px solid #ddd", padding: "16px", borderRadius: "8px" }}>
      <h3>Preview</h3>
      <h4>{courseDetails.title}</h4>
      <p>{courseDetails.description}</p>
      <p><strong>Duration:</strong> {courseDetails.duration}</p>
      <p><strong>Level:</strong> {courseDetails.level}</p>
      <p><strong>Contents:</strong> {contents.length > 0 ? contents.join(", ") : "No contents added yet."}</p>
    </div>
  );
}
