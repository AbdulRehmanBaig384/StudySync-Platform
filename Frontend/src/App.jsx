import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import FindPartner from "./Pages/FindPartner";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import StudentProfile from "./Pages/StudentProfile";
import CodingRooms from "./Pages/CodingRooms";
import StudySession from "./Pages/StudySession";
import Resources from "./Pages/Resources";
import AITutor from "./Pages/AITutor";
import ProHub from "./Pages/ProHub";
import Quizzes from "./Pages/Quizzes";
import NotFound from "./Pages/NotFound";
import CompleteProfile from "./Pages/CompleteProfile";
import Chat from "./Pages/Chat";
import ProtectedRoute from "./components/ProtectedRoute";
import { TimerProvider } from "./context/TimerContext";
import { SocketProvider } from "./context/SocketContext";

function App() {
  return (
    <SocketProvider>
      <TimerProvider>
        <Router>
          {/* ... routes ... */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/complete-profile" element={<CompleteProfile />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/find-partner"
              element={
                <ProtectedRoute>
                  <FindPartner />
                </ProtectedRoute>
              }
            />
            <Route
              path="/StudentProfile"
              element={
                <ProtectedRoute>
                  <StudentProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/CodingRooms"
              element={
                <ProtectedRoute>
                  <CodingRooms />
                </ProtectedRoute>
              }
            />
            <Route
              path="/StudySession"
              element={
                <ProtectedRoute>
                  <StudySession />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resources"
              element={
                <ProtectedRoute>
                  <Resources />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai-tutor"
              element={
                <ProtectedRoute>
                  <AITutor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pro-hub"
              element={
                <ProtectedRoute>
                  <ProHub />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quizzes"
              element={
                <ProtectedRoute>
                  <Quizzes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </TimerProvider>
    </SocketProvider>
  );
}

export default App;
