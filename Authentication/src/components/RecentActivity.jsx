"use client"

import { FiBook, FiCheckCircle, FiAward } from "react-icons/fi"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

export default function RecentActivity() {
  // Sample data - replace with API data
  const activities = [
    {
      id: 1,
      type: "course_completed",
      title: "Advanced React Patterns",
      icon: <FiCheckCircle />,
      color: "#10b981",
      timestamp: new Date(Date.now() - 3600000 * 2), // 2 hours ago
    },
    {
      id: 2,
      type: "course_started",
      title: "Node.js Fundamentals",
      icon: <FiBook />,
      color: "#3b82f6",
      timestamp: new Date(Date.now() - 3600000 * 8), // 8 hours ago
    },
    {
      id: 3,
      type: "achievement",
      title: "5-Day Learning Streak",
      icon: <FiAward />,
      color: "#f59e0b",
      timestamp: new Date(Date.now() - 3600000 * 24), // 1 day ago
    },
  ]

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-3 group">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ backgroundColor: `${activity.color}15`, color: activity.color }}
          >
            {activity.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {activity.title}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{dayjs(activity.timestamp).fromNow()}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
