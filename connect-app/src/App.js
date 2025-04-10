import React from "react";
import LandingPage from "./components/LandingPage";
import PrimaryHomePage from "./components/PrimaryHomePage";
import SupportHomePage from "./components/SupportHomePage";
import HelpPage from "./components/HelpPage";
import CreateAccount from "./components/CreateAccount";
import Gallery from "./components/Gallery";
import ExerciseSelection from "./components/ExerciseSelection";
import AddPrimary from "./components/AddPrimary";
import AddSupport from "./components/AddSupport";
import UploadPage from "./components/UploadPage";
import SpeedProcessing from "./components/exercises/SpeedProcessing";
import MemoryGame from "./components/exercises/MemoryGame";
import ColorMatch from "./components/exercises/ColorMatch";
import WritingExercise from "./components/exercises/WritingExercise";
import OptionsForMatching from "./components/exercises/OptionsForMatching";
import ShapeMatch from "./components/exercises/ShapeMatch";
import Journal from "./components/Journal";
import SurveyPage from "./components/SurveyPage";
import PreSurvey from "./components/PreSurvey";
import EventsExercise from "./components/exercises/EventsExercise";
import WordSearch from "./components/exercises/WordSearch";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { MediaProvider } from "./components/MediaContext";

function App() {
  return (
    <MediaProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/primaryhomepage" element={<PrimaryHomePage />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/exerciseselection" element={<ExerciseSelection />} />
          <Route path="/addprimary" element={<AddPrimary />} />
          <Route path="/addsupport" element={<AddSupport />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/speed-processing" element={<SpeedProcessing />} />
          <Route path="/memorygame" element={<MemoryGame />} />
          <Route path="/optionsformatching" element={<OptionsForMatching />} />
          <Route path="/colormatch" element={<ColorMatch />} />
          <Route path="/shapematch" element={<ShapeMatch />} />
          <Route path="/writingexercise" element={<WritingExercise />} />
          <Route path="/supporthomepage" element={<SupportHomePage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/createAccount" element={<CreateAccount />} />
          <Route path="/survey" element={<SurveyPage />} />
          <Route path="/presurvey" element={<PreSurvey />} />
          <Route path="/eventsexercise" element={<EventsExercise />} />
          <Route path="/wordsearch" element={<WordSearch />} />
        </Routes>
      </Router>
    </MediaProvider>
  );
}

export default App;
