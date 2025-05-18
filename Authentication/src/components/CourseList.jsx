import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const CourseList = ({ courses, selectedCourse, onSelectCourse }) => {
  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500 dark:text-slate-400">No courses available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {courses.map((course) => (
        <Card
          key={course.id}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedCourse?.id === course.id
              ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-slate-700"
              : "border-slate-200 dark:border-slate-700"
          }`}
          onClick={() => onSelectCourse(course)}
        >
          <div className="flex items-center gap-4 p-4">
            <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-md flex-shrink-0 overflow-hidden">
              {course.thumbnail ? (
                <img
                  src={course.thumbnail || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {course.title.charAt(0)}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-slate-900 dark:text-white truncate">
                  {course.title}
                </h3>
                {course.published && (
                  <Badge
                    variant="outline"
                    className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800"
                  >
                    Published
                  </Badge>
                )}
              </div>

              {course.progress !== undefined && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Progress
                    </span>
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                      {course.progress}%
                    </span>
                  </div>
                  <Progress value={course.progress} className="h-1" />
                </div>
              )}

              {course.contents && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {course.contents.length}{" "}
                  {course.contents.length === 1 ? "lesson" : "lessons"}
                </p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default CourseList;
