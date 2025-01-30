import React from "react";
import LoginPage from "./components/LoginPage"; 
import HelpPage from "./components/HelpPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/help" element={<HelpPage />} /> 
      </Routes>
    </Router>
  );
}

export default App;
