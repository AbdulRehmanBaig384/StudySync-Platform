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
import SessionLobby from "./Pages/SessionLobby";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import GoogleCallback from "./Pages/GoogleCallback";
import { TimerProvider } from "./context/TimerContext";
import { SocketProvider } from "./context/SocketContext";

import { AuthGuardProvider } from "./context/AuthGuardContext";

function App() {
  return (
    <SocketProvider>
      <TimerProvider>
        <Router>
          <AuthGuardProvider>
            {/* ... routes ... */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <PublicRoute>
                    <SignUp />
                  </PublicRoute>
                }
              />
              <Route
                path="/complete-profile"
                element={
                  <ProtectedRoute>
                    <CompleteProfile />
                  </ProtectedRoute>
                }
              />
              <Route path="/auth/google/callback" element={<GoogleCallback />} />

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
                    <SessionLobby />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/StudyRoom/:sessionId"
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
          </AuthGuardProvider>
        </Router>
      </TimerProvider>
    </SocketProvider>
  );
}

export default App;
