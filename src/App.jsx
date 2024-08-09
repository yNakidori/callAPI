import React from "react";
import { Routes, Route } from "react-router-dom";
import LogIn from "./pages/logIn";

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LogIn />} />
      </Routes>
    </div>
  );
};

export default App;
