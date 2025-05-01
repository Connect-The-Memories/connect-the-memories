import React from "react";
import { useNavigate } from "react-router-dom";
import "../ExerciseSelection.css";
import DarkModeToggle from "../DarkModeToggle";

function OptionsForColor() {
    const navigate = useNavigate();

    return (
        <div className="exercise-container">
                    <nav className="nav-bar">
                        <a href="/primaryhomepage"><div className="title">CogniSphere</div></a>
                        <div className="navbar-separator"></div>
                        <DarkModeToggle />
                        <button className="logout-button" onClick={() => navigate("/exerciseselection")}>← Back</button>
                    </nav>

            <div className="inner-box">
            {/* title */}
            <h1 className="exercise-title">Select Difficulty</h1>

            {/* Exercise Grid */}
            <div className="exercise-grid">
                <div className="exercise-card" onClick={() => navigate("/easycolormatch")}>
                    <div className="exercise-icon">🎨</div>
                    <p className="exercise-name">Easy</p>
                </div>

                <div className="exercise-card" onClick={() => navigate("/colormatch")}>
                    <div className="exercise-icon">🎨</div>
                    <p className="exercise-name">Hard</p>
                </div>
            </div>
        </div>
        </div>
    );

}

export default OptionsForColor;