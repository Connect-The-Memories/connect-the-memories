import "./Gallery.css";
import React from "react";
import { useNavigate } from "react-router-dom";

function Gallery() {
    const navigate = useNavigate();

    return (
        <div className= "gallery-container">
            <nav className= "gallery-top-bar">
                <div className= "gallery-title">CogniSphere</div>
                <button className="gallery-back-button" onClick={() => navigate("/primaryhomepage")}>← Back</button>
      </nav>

        <div className="gallery-content">
            <h2 className="gallery-empty-text">No media uploaded yet</h2>
        </div>
    </div>
    );
}

export default Gallery; 