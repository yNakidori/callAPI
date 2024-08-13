import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LogIn from "./pages/logIn";
import SignIn from "./pages/signIn";
import ForgotPassword from "./pages/forgotPassword";
import HomePage from "./pages/homePage";
import ProfilePage from "./pages/profilePage";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LogIn />} />
          <Route path="signIn" element={<SignIn />} />
          <Route path="forgotPassword" element={<ForgotPassword />} />
          {/* Protected routes */}
          <Route
            path="homePage"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="profilePage"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          {/* Protected routes */}
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
