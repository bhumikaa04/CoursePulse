import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css' 
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import Dashboard from './components/Dashboard.jsx'
import OuterAbout from './components/OuterAbout.jsx'
import OuterHome from './components/OuterHome.jsx'
import Explore from './components/Explore.jsx'
import {BrowserRouter , Routes , Route} from 'react-router-dom'
import SearchComponent from './components/SearchComponent.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import VideoPlayer from './components/VideoPlayer.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import EditProfilePage from './components/EditProfilePage.jsx'
import MyCourses from './components/MyCourses.jsx'
import AllCoursesPage from './components/AllCoursesPage.jsx'
import {NotificationProvider} from './context/NotificationContext.jsx'
import NewCourse from './pages/NewCourse.jsx'
import CourseComponent from './components/CourseComponent.jsx'


function App() {
  return (
    
    <>
    <NotificationProvider>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<OuterAbout />} />
          <Route path="/OuterHome" element={<OuterHome />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/search" element={<SearchComponent />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/video-player" element={<VideoPlayer />} />
          <Route path="/video-player/:contentId" element={<VideoPlayer />} />
          <Route path="/video-player/:contentId/:type" element={<VideoPlayer />} />
          <Route path="/edit-profile/:username" element={<EditProfilePage />} />
          <Route path="/my-created-courses" element={<MyCourses />} />
          <Route path='/my-courses' element= {<AllCoursesPage/>} />
          <Route path='/course' element= {< NewCourse/>} />
          <Route path='/course/:id/:title' element={< CourseComponent/>} />
        </Routes>
      </BrowserRouter>  
    </AuthProvider>
    </NotificationProvider>
    </>
  )
}


export default App
