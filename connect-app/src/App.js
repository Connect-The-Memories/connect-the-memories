import React from "react";
import LoginPage from "./components/LoginPage"; 
import PrimaryHomePage from "./components/PrimaryHomePage";
import SupportHomePage from "./components/SupportHomePage";
import HelpPage from "./components/HelpPage";
import CreateAccount from "./components/CreateAccount"; 
import LoggingIn from "./components/LoggingIn";
import Gallery from "./components/Gallery"; 
import ExerciseSelection from "./components/ExerciseSelection";
import SpeedProcessing from "./components/SpeedProcessing";
import MemoryGame from "./components/MemoryGame"; 
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/primaryhomepage" element={<PrimaryHomePage />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/exerciseselection" element={<ExerciseSelection />} /> 
            <Route path="/speed-processing" element={<SpeedProcessing />} />
            <Route path="/memorygame" element={<MemoryGame />} /> 
        <Route path="/supporthomepage" element={<SupportHomePage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/createAccount" element={<CreateAccount />} /> 
        <Route path="/loggingIn" element={<LoggingIn />} /> 
      </Routes>
    </Router>
  );
}

export default App;
