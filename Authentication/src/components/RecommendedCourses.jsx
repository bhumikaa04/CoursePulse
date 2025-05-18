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
      thumbnail: "/placeholder.svg?height=60&width=80",
    },
    {
      id: 2,
      title: "Advanced JavaScript Concepts",
      description: "Master closures, prototypes and async patterns",
      rating: 4.6,
      thumbnail: "/placeholder.svg?height=60&width=80",
    },
    {
      id: 3,
      title: "TypeScript Fundamentals",
      description: "Type-safe JavaScript development",
      rating: 4.7,
      thumbnail: "/placeholder.svg?height=60&width=80",
    },
  ];

  return (
    <div className="space-y-3">
      {recommendedCourses.map((course) => (
        <div
          key={course.id}
          className="flex gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group cursor-pointer"
        >
          <div className="w-20 h-15 rounded-md overflow-hidden flex-shrink-0">
            <img
              src={course.thumbnail || "/placeholder.svg"}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {course.title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
              {course.description}
            </p>
            <div className="flex items-center gap-1 mt-1.5">
              <FiStar className="text-yellow-500 h-3.5 w-3.5 fill-yellow-500" />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {course.rating}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
