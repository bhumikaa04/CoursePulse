import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css' 
import Signup from './Signup.jsx'
import Login from './Login.jsx'
import Home from './Home.jsx'
import Dashboard from './Dashboard.jsx'
import OuterAbout from './OuterAbout.jsx'
import OuterHome from './OuterHome.jsx'
import Explore from './Explore.jsx'
import Profile from './profile.jsx'
import ProfileForm from './ProfileForm.jsx'
import {BrowserRouter , Routes , Route} from 'react-router-dom'
import SearchComponent from './SearchComponent.jsx'
import Navbar from './Navbar.jsx'
import CourseCreator from './CourseCreator.jsx'

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
          <Route path="/profile" element={<Profile />} />
          <Route path="/profileForm" element={<ProfileForm />} />
          <Route path="/search" element={<SearchComponent />} />
          <Route path="/create-course" element={<CourseCreator />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
