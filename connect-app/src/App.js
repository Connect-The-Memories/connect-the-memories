import React from "react";
import LoginPage from "./components/LoginPage"; 
import HelpPage from "./components/HelpPage";
import CreateAccount from "./components/CreateAccount"; 
import LoggingIn from "./components/LoggingIn";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/createAccount" element={<CreateAccount />} /> 
        <Route path="/loggingIn" element={<LoggingIn />} /> 
      </Routes>
    </Router>
  );
}

export default App;
