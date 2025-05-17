"use client"

import { useState, useEffect } from "react"
import {
  FiBook,
  FiPlusCircle,
  FiTrendingUp,
  FiAward,
  FiClock,
  FiBookmark,
  FiCheckCircle,
  FiStar,
  FiCalendar,
  FiMenu,
  FiX,
  FiUser,
  FiSettings,
  FiLogOut,
  FiGrid,
  FiList,
  FiMoon,
  FiSun,
} from "react-icons/fi"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "next-themes"
import CourseProgressChart from "./CourseProgressChart"
import RecentActivity from "./RecentActivity"
import RecommendedCourses from "./RecommendedCourses"

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [viewMode, setViewMode] = useState("grid")
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // After mounting, we can safely show the UI that depends on the theme
  useEffect(() => {
    setMounted(true)
  }, [])

  // Mock user data - would come from context/API in a real app
  const user = {
    username: "Alex Johnson",
    email: "alex@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
  }

  // Mock stats data
  const stats = {
    coursesCreated: 5,
    coursesEnrolled: 12,
    completionRate: 68,
    learningStreak: 7,
  }

  // Prevent hydration mismatch by not rendering theme-dependent UI until mounted
  if (!mounted) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <aside
        className={`fixed lg:relative z-20 bg-white dark:bg-slate-800 shadow-md transition-all duration-300 h-full ${
          isSidebarOpen ? "w-64" : "w-0 lg:w-20"
        } overflow-hidden`}
      >
        <div className="flex flex-col h-full">
          <div className={`p-4 flex items-center ${!isSidebarOpen && "lg:justify-center"}`}>
            <div className="w-10 h-10 rounded-md bg-slate-800 dark:bg-slate-700 flex items-center justify-center text-white font-bold text-xl">
              L
            </div>
            {isSidebarOpen && <span className="ml-3 font-bold text-xl dark:text-white">LearnHub</span>}
          </div>

          <Separator className="dark:bg-slate-700" />

          <nav className="flex-1 py-6">
            <ul className="space-y-1">
              {[
                { icon: <FiGrid />, label: "Dashboard", active: true },
                { icon: <FiBook />, label: "My Courses" },
                { icon: <FiAward />, label: "Achievements" },
                { icon: <FiBookmark />, label: "Bookmarks" },
                { icon: <FiSettings />, label: "Settings" },
              ].map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className={`flex items-center px-4 py-3 ${!isSidebarOpen && "lg:justify-center"} ${
                      item.active
                        ? "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white font-medium"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {isSidebarOpen && <span className="ml-3">{item.label}</span>}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 dark:text-slate-300 dark:border-slate-700"
              onClick={() => console.log("Logout")}
            >
              <FiLogOut className="h-4 w-4" />
              {isSidebarOpen && <span>Logout</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="mr-2 lg:hidden dark:text-slate-300"
              >
                {isSidebarOpen ? <FiX /> : <FiMenu />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="mr-2 hidden lg:flex dark:text-slate-300"
              >
                <FiMenu />
              </Button>
              <h1 className="text-xl font-semibold dark:text-white">Dashboard</h1>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
                className="rounded-full"
              >
                {theme === "dark" ? (
                  <FiSun className="h-5 w-5 text-yellow-400" />
                ) : (
                  <FiMoon className="h-5 w-5 text-slate-700" />
                )}
              </Button>

              <Badge
                variant="outline"
                className="flex items-center gap-1 py-1.5 dark:border-slate-700 dark:text-slate-300"
              >
                <FiCalendar className="h-3.5 w-3.5" />
                <span>
                  {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                </span>
              </Badge>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar>
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
                      <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center gap-2">
                    <FiUser className="h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2">
                    <FiSettings className="h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center gap-2">
                    <FiLogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 md:p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back, {user.username}!</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Here's what's happening with your learning today</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={<FiBook />}
              value={stats.coursesEnrolled}
              label="Courses Enrolled"
              color="#3b82f6"
              trend="up"
              trendValue="+2 this month"
            />
            <StatCard icon={<FiPlusCircle />} value={stats.coursesCreated} label="Courses Created" color="#10b981" />
            <StatCard
              icon={<FiCheckCircle />}
              value={`${stats.completionRate}%`}
              label="Completion Rate"
              color="#8b5cf6"
            />
            <StatCard icon={<FiClock />} value={stats.learningStreak} label="Day Streak" color="#ef4444" streakBadge />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column (2/3 width on large screens) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Progress Chart */}
              <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium flex items-center gap-2 dark:text-white">
                    <FiTrendingUp className="h-5 w-5 text-blue-500" />
                    Your Learning Progress
                  </CardTitle>
                  <select className="text-sm border rounded-md px-2 py-1 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                  </select>
                </CardHeader>
                <CardContent>
                  <CourseProgressChart />
                </CardContent>
              </Card>

              {/* Recent Courses */}
              <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium flex items-center gap-2 dark:text-white">
                    <FiBookmark className="h-5 w-5 text-blue-500" />
                    Recently Accessed Courses
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setViewMode("grid")}
                      className={viewMode === "grid" ? "bg-slate-100 dark:bg-slate-700" : "dark:text-slate-300"}
                    >
                      <FiGrid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setViewMode("list")}
                      className={viewMode === "list" ? "bg-slate-100 dark:bg-slate-700" : "dark:text-slate-300"}
                    >
                      <FiList className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map((course) => (
                        <CourseCard key={course} />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {[1, 2, 3, 4].map((course) => (
                        <CourseListItem key={course} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column (1/3 width on large screens) */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center gap-2 dark:text-white">
                    <FiStar className="h-5 w-5 text-blue-500" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full flex items-center justify-center gap-2">
                    <FiPlusCircle className="h-4 w-4" />
                    Create New Course
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 dark:border-slate-600 dark:text-slate-300"
                  >
                    <FiAward className="h-4 w-4" />
                    Browse Courses
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 dark:border-slate-600 dark:text-slate-300"
                  >
                    <FiBook className="h-4 w-4" />
                    My Courses
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center gap-2 dark:text-white">
                    <FiClock className="h-5 w-5 text-blue-500" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RecentActivity />
                </CardContent>
              </Card>

              {/* Recommended Courses */}
              <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center gap-2 dark:text-white">
                    <FiStar className="h-5 w-5 text-blue-500" />
                    Recommended For You
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RecommendedCourses />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

// Stat Card Component
function StatCard({ icon, value, label, color, trend, trendValue, streakBadge }) {
  return (
    <Card className="relative overflow-hidden dark:bg-slate-800 dark:border-slate-700">
      <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: color }}></div>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
            style={{ backgroundColor: `${color}15` }}
          >
            <span className="text-xl" style={{ color }}>
              {icon}
            </span>
          </div>
          <div className="text-3xl font-bold mb-1" style={{ color }}>
            {value}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">{label}</div>

          {trend && (
            <Badge variant="outline" className="mt-2 text-xs" style={{ color, backgroundColor: `${color}15` }}>
              {trendValue}
            </Badge>
          )}

          {streakBadge && (
            <Badge
              variant="outline"
              className="mt-2 text-xs flex items-center gap-1"
              style={{ color, backgroundColor: `${color}15` }}
            >
              <FiClock className="h-3 w-3" />
              Current streak
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Course Card Component
function CourseCard() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-32 bg-slate-200 dark:bg-slate-700 relative">
        <img
          src="/placeholder.svg?height=128&width=256"
          alt="Course thumbnail"
          className="w-full h-full object-cover"
        />
        <Badge className="absolute top-2 right-2 bg-blue-500">In Progress</Badge>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-slate-900 dark:text-white mb-1">Advanced React Patterns</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">Last accessed: 2 days ago</span>
          <span className="text-xs font-medium text-blue-600 dark:text-blue-400">65%</span>
        </div>
        <Progress value={65} className="h-1.5" />
      </div>
    </div>
  )
}

// Course List Item Component
function CourseListItem() {
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg border dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
      <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-md flex-shrink-0 overflow-hidden">
        <img src="/placeholder.svg?height=48&width=48" alt="Course thumbnail" className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-slate-900 dark:text-white truncate">Advanced React Patterns</h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-slate-500 dark:text-slate-400">Last accessed: 2 days ago</span>
          <span className="text-xs font-medium text-blue-600 dark:text-blue-400">65%</span>
        </div>
        <Progress value={65} className="h-1.5 mt-1.5" />
      </div>
    </div>
  )
}
