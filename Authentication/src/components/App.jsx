import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css' 
import Signup from './Signup.jsx'
import Login from './Login.jsx'
import Home from './Home.jsx'
import Dashboard from './Dashboard.jsx'
import {BrowserRouter , Routes , Route} from 'react-router-dom'

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
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
