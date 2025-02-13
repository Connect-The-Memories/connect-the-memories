import React from "react";
import { useNavigate } from "react-router-dom";
import "./ExerciseSelection.css";

function ExerciseSelection() {
  const navigate = useNavigate();

  return (
    <div className="exercise-container">
      {/* Top Bar */}
      <nav className="top-bar">
        <div className="title">CogniSphere</div>
        <button className="back-button" onClick={() => navigate("/primaryhomepage")}>← Back</button>
      </nav>

      {/* Exercise Title */}
      <h1 className="exercise-title">Exercises</h1>

      {/* Exercise Grid */}
      <div className="exercise-grid">
        <div className="exercise-card" onClick={() => navigate("/speed-processing")}>
          <div className="exercise-icon">⚡</div>
          <p>Speed Processing</p>
        </div>
        <div className="exercise-card inactive">
          <div className="exercise-icon">🔤</div>
          <p>Word Search</p>
        </div>
        <div className="exercise-card" onClick={() => navigate("/memorygame")}>
          <div className="exercise-icon">🧩</div>
          <p>Thai Game</p>
        </div>
      </div>
    </div>
  );
}

export default ExerciseSelection;
