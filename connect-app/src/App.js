import React from "react";
import LandingPage from "./components/LandingPage";
import PrimaryHomePage from "./components/PrimaryHomePage";
import SupportHomePage from "./components/SupportHomePage";
import HelpPage from "./components/HelpPage";
import CreateAccount from "./components/CreateAccount";
import Gallery from "./components/Gallery";
import ExerciseSelection from "./components/ExerciseSelection";
import SpeedProcessing from "./components/SpeedProcessing";
import MemoryGame from "./components/MemoryGame";
import ColorMatch from "./components/ColorMatch";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/primaryhomepage" element={<PrimaryHomePage />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/exerciseselection" element={<ExerciseSelection />} />
        <Route path="/speed-processing" element={<SpeedProcessing />} />
        <Route path="/memorygame" element={<MemoryGame />} />
        <Route path="/colormatch" element={<ColorMatch />} />
        <Route path="/supporthomepage" element={<SupportHomePage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/createAccount" element={<CreateAccount />} />
      </Routes>
    </Router>
  );
}

export default App;
