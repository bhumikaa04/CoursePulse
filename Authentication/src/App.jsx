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
import CourseCreator from './components/CourseCreator.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import VideoPlayer from './components/VideoPlayer.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import EditProfilePage from './components/EditProfilePage.jsx'
import { useContext } from 'react'
import { AuthContext } from './context/AuthContext.jsx'
import { ThemeContext } from './context/ThemeContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import MyCourses from './components/MyCourses.jsx'

function App() {
  return (
    
    <>
    <AuthProvider>
    <ThemeProvider>
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
          <Route path="/create-course" element={<CourseCreator />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/video-player" element={<VideoPlayer />} />
          <Route path="/video-player/:contentId" element={<VideoPlayer />} />
          <Route path="/video-player/:contentId/:type" element={<VideoPlayer />} />
          <Route path="/edit-profile/:username" element={<EditProfilePage />} />
          <Route path="/my-created-courses" element={<MyCourses />} />
        </Routes>
      </BrowserRouter>  
    </ThemeProvider>
    </AuthProvider>
    </>
  )
}


export default App
