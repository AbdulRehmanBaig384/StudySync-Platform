import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './Pages/Home'
import Dashboard from './Pages/Dashboard'
import FindPartner from './Pages/FindPartner'
import Login from './components/Login'
import SignUp from './components/SignUp'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/find-partner" element={<FindPartner />} />
      </Routes>
    </Router>
  )
}

export default App
