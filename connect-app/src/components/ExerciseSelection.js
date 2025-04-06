import React from "react";
import { useNavigate } from "react-router-dom";
import "./ExerciseSelection.css";

function ExerciseSelection() {
  const navigate = useNavigate();

  return (
    <div className="exercise-container">
      {/* Top Bar */}
      <nav className="nav-bar">
        <div className="title">CogniSphere</div>
        <button className="logout-button" onClick={() => navigate("/primaryhomepage")}>← Back</button>
      </nav>

      <div className="inner-box">
        {/* Exercise Title */}
        <h1 className="exercise-title">Exercises</h1>

        {/* Exercise Grid */}
        <div className="exercise-grid">
          <div className="exercise-card" onClick={() => navigate("/speed-processing")}>
            <div className="exercise-icon">⚡</div>
            <p className="exercise-name">Speed Processing</p>
          </div>
          <div className="exercise-card" onClick={() => navigate("/memorygame")}>
            <div className="exercise-icon">🧩</div>
            <p className="exercise-name">Thai Game</p>
          </div>
          <div className="exercise-card" onClick={() => navigate("/optionsformatching")}>
            <div className="exercise-icon">🎨</div>
            <p className="exercise-name">Color/Shape Match</p>
          </div>
          <div className="exercise-card" onClick={() => navigate("/writingexercise")}>
            <div className="exercise-icon">✍️</div>
            <p className="exercise-name">Writing Exercise</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExerciseSelection;
