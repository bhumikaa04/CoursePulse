import React, { useState } from "react";

export default function AddContentModal({ onClose, onAddContent }) {
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      onAddContent(content);
      setContent("");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "16px",
          borderRadius: "8px",
          width: "300px",
        }}
      >
        <h3>Add New Content</h3>
        <form onSubmit={handleSubmit}>
          <input
            style={{ marginBottom: "8px", width: "100%", padding: "8px" }}
            type="text"
            placeholder="Content Title"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            style={{
              padding: "8px 12px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            type="submit"
          >
            Add
          </button>
        </form>
        <button
          style={{
            marginTop: "8px",
            padding: "8px 12px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
