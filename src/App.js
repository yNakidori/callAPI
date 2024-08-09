import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LogIn from "./pages/logIn";
import SignIn from "./pages/signIn";
import ForgotPassword from "./pages/forgotPassword";
import HomePage from "./pages/homePage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LogIn />} />,
        <Route path="signIn" element={<SignIn />} />
        <Route path="forgotPassword" element={<ForgotPassword />} />
        <Route path="homePage" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default App;
