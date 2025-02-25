import React from "react";
import { useNavigate } from "react-router-dom";
import "./ExerciseSelection.css"; 

function OptionsForMatching() {
    const navigate = useNavigate();

    return (
        <div className="exercise-container">
            <nav className="top-bar">
                <div className="title">CogniSphere</div>
                <button className="logout-button" onClick={() => navigate("/exerciseselection")}>← Back</button>
            </nav>
    
            {/* title */}
            <h1 className="exercise-title">Options</h1>
    
            {/* Exercise Grid */}
            <div className="exercise-grid">
                <div className="exercise-card" onClick={() => navigate("/colormatch")}>
                    <div className="exercise-icon">🎨</div>
                    <p className="exercise-name">Color Match</p>
                </div>
    
                <div className="exercise-card" onClick={() => navigate("/shapematch")}>
                    <div className="exercise-icon">🔺</div>
                    <p className="exercise-name">Shape Match</p>
                </div>
            </div>
        </div> 
    );
        
}

export default OptionsForMatching;