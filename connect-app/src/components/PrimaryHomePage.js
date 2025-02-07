import React, { useReducer } from "react";
import { useNavigate } from "react-router-dom";
import "./PrimaryHomePage.css"; 

function PrimaryHomePage() {
  const navigate = useNavigate();

  const userName = "Bruce"

  return (
    <div className="container">
      <div className="top-bar">
        <div className="top-right-title">CogniSphere</div>
        <button className="logout-button">LOGOUT</button>
      </div>
      <div className="inner-box">
        <button className="progress-button">View Progress</button>
        <div className="action-buttons-container">
          <div className="button-container">
            <button className="gallery-button" onClick={() => navigate("/")}> </button>
            <p className="action-buttons-text">Media Gallery</p>
          </div>
          <div className="button-container">
            <button className="exercises-button" onClick={() => navigate("/")}> </button>
            <p className="action-buttons-text">Exercises</p>
          </div>
          <div className="button-container">
            <button className="add-button" onClick={() => navigate("/")}> </button>
            <p className="action-buttons-text">Add Friends or Family</p>
          </div>
        </div>
        <div className="welcome-message">Welcome back, {userName}</div>
      </div>
    </div>
  );
}

export default PrimaryHomePage;
