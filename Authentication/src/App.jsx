import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css' 
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import Dashboard from './components/Dashboard.jsx'
import OuterAbout from './components/OuterAbout.jsx'
import OuterHome from './components/OuterHome.jsx'
import Explore from './components/Explore.jsx'
import ProfileForm from './components/ProfileForm.jsx'
import {BrowserRouter , Routes , Route} from 'react-router-dom'
import SearchComponent from './components/SearchComponent.jsx'
import CourseCreator from './components/CourseCreator.jsx'
import ProfilePage from './pages/ProfilePage.jsx'

function App() {
  return (
    
    <>
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
          <Route path="/profileForm" element={<ProfileForm />} />
          <Route path="/search" element={<SearchComponent />} />
          <Route path="/create-course" element={<CourseCreator />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
