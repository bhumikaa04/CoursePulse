"use client";

import React from "react";
import { FiStar } from "react-icons/fi";

export default function RecommendedCourses() {
  // Sample data - replace with API data
  const recommendedCourses = [
    {
      id: 1,
      title: "React Hooks Masterclass",
      description: "Deep dive into modern React patterns",
      rating: 4.8,
    },
    {
      id: 2,
      title: "Advanced JavaScript Concepts",
      description: "Master closures, prototypes and async patterns",
      rating: 4.6,
    },
    {
      id: 3,
      title: "TypeScript Fundamentals",
      description: "Type-safe JavaScript development",
      rating: 4.7,
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {recommendedCourses.map((course) => (
        <div
          key={course.id}
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "1rem",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
            transition: "background-color 0.3s",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e0f7fa")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f9f9f9")}
        >
          <h4
            style={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              color: "#333",
              margin: 0,
              marginBottom: "0.5rem",
            }}
          >
            {course.title}
          </h4>
          <p
            style={{
              fontSize: "0.9rem",
              color: "#666",
              margin: 0,
              marginBottom: "0.75rem",
            }}
          >
            {course.description}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <FiStar style={{ color: "#ffc107", width: "16px", height: "16px" }} />
            <span style={{ fontSize: "0.9rem", fontWeight: "500", color: "#444" }}>
              {course.rating}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}