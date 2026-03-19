import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './Pages/Home'
import Dashboard from './Pages/Dashboard'
import FindPartner from './Pages/FindPartner'
import Login from './components/Login'
import SignUp from './components/SignUp'
import StudentProfile from './Pages/StudentProfile'
import CodingRooms from './Pages/CodingRooms'
import StudySession from './Pages/StudySession'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/find-partner" element={<FindPartner />} />
        <Route path="/StudentProfile" element={<StudentProfile/>}/>
        <Route path="/CodingRooms" element={<CodingRooms/>}/>
        <Route path="/StudySession" element={<StudySession/>}/>
      </Routes>
    </Router>
  )
}

export default App
