import React from "react";
import { useNavigate } from "react-router-dom";
import DarkModeToggle from "../DarkModeToggle";
import "../ExerciseSelection.css";

function OptionsForMatching() {
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
                <h1 className="exercise-title">Options</h1>
            {/* Exercise Grid */}
            <div className="exercise-grid">
                <div className="exercise-card" onClick={() => navigate("/optionsforcolor")}>
                    <div className="exercise-icon">🎨</div>
                    <p className="exercise-name">Color Match</p>
                </div>

                    <div className="exercise-card" onClick={() => navigate("/shapematch")}>
                        <div className="exercise-icon">🔺</div>
                        <p className="exercise-name">Shape Match</p>
                    </div>
                </div>
            </div>

        </div>
    );

}

export default OptionsForMatching;