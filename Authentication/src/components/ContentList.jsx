import React from "react";

export default function ContentList({ contents }) {
  return (
    <div style={{ marginTop: "16px" }}>
      <h3>Course Contents:</h3>
      {contents.length === 0 ? (
        <p>No content added yet.</p>
      ) : (
        <ul>
          {contents.map((content, index) => (
            <li key={index}>{content}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
