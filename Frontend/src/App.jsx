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
import Resources from './Pages/Resources'
import AITutor from './Pages/AITutor'
import ProHub from './Pages/ProHub'

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
        <Route path="/resources" element={<Resources/>}/>
        <Route path="/ai-tutor" element={<AITutor/>}/>
        <Route path="/pro-hub" element={<ProHub/>}/>
      </Routes>
    </Router>
  )
}

export default App
