import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

import galleryIcon from '../assets/gallery-icon-black.png';
import friendIcon from '../assets/friend-icon-black.png';
import { getUserInfo } from "../api/auth";

function SupportHomePage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const userInfo = await getUserInfo();
        const first_name = userInfo.data.first_name;
        setUserName(first_name);
      } catch (error) {
        console.error(error);
        setUserName("Guest");
      }
    }

    fetchUserInfo();
  }, []);

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
            <button className=" action-button gallery-button" onClick={() => navigate("/upload")}>
              <img src={galleryIcon} alt="gallery icon" className="action-button-icon" />
              <p className="action-buttons-text">Upload Media</p>
            </button>
          </div>
          <div className="button-container">
            <button className="action-button add-button" onClick={() => navigate("/addprimary")}>
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
