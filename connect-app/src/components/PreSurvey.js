import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PreSurvey.css"; 

function PreSurvey() {
    const navigate = useNavigate();

    return(
        <div className="survey-page">
          <nav className="nav-bar">
            <a href="/">
              <div className="title">CogniSphere</div>
            </a>
            <button
              className="logout-button"
              onClick={() => navigate("/")}
            >
              ← Back
            </button>
          </nav>
        <div className="addpage-inner-box">
            <div className="addpage-title-text">Baseline Cognitive & Wellness Survey</div>
            <p className="addpage-text">Before you start your journey with CogniSphere, we’d love to get to know you better! 
                This quick survey will help us understand your cognitive health and wellness, allowing us to personalize 
                your experience and tailor the app to your needs.</p>
            <button onClick={() => navigate("/survey")} className="generate-button">Begin Survey</button>
        </div>      
        </div>
    );
}

export default PreSurvey;

// epic change