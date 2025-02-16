import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css"; 
import galleryIcon from '../assets/gallery-icon.png';
import friendIcon from '../assets/friend-icon.png';

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
        <div className="action-buttons-container">
          <div className="button-container">
            <button className=" action-button gallery-button" onClick={() => navigate("/upload")}>
              <img src={galleryIcon} alt="gallery icon" className="action-button-icon"/>
            </button>
            <p className="action-buttons-text">Upload Media</p>
          </div>
          <div className="button-container">
            <button className="action-button add-button" onClick={() => navigate("/addprimary")}>
              <img src={friendIcon} alt="friends icon" className="action-button-icon"/></button>
            <p className="action-buttons-text">Connect with User</p>
          </div>
        </div>
      <div className="welcome-message">Welcome, {userName}</div>
    </div>
  </div>
  );
}

export default SupportHomePage;
