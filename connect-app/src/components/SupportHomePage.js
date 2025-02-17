import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

import galleryIcon from '../assets/gallery-icon-white.png';
import friendIcon from '../assets/friend-icon-white.png';

function SupportHomePage() {
  const navigate = useNavigate();

  const userName = 'Bruce'

  return (
    <div className="hp-container">
      <nav className="nav-bar">
        <a href="/"><div className="title">CogniSphere</div></a>
        <button className="logout-button" onClick={() => navigate("/")}>LOGOUT</button>
      </nav>
      <div className="inner-box">
        <div className="welcome-message">Welcome, {userName}</div>
        <div className="action-buttons-container support-container">
          <div className="button-container">
            <button className=" action-button" onClick={() => navigate("/upload")}>
              <img src={galleryIcon} alt="gallery icon" className="action-button-icon" />
              <p className="action-buttons-text">Upload Media</p>
            </button>
          </div>
          <div className="button-container">
            <button className="action-button" onClick={() => navigate("/addprimary")}>
              <img src={friendIcon} alt="friends icon" className="action-button-icon" />
              <p className="action-buttons-text">Add a Primary User</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupportHomePage;
