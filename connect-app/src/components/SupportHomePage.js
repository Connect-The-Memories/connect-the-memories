import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

import DarkModeToggle from "./DarkModeToggle";
import galleryIcon from '../assets/gallery-icon-black.png';
import friendIcon from '../assets/friend-icon-black.png';
import { logout, getUserInfo } from "../api/auth";
import { useAuth } from "../context/AuthContext";

function SupportHomePage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const { token, logout: contextLogout } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {

    if (!token) {
      setError("You are not logged in.");
      setTimeout(() => navigate("/"), 100);
      return;
    }

    async function fetchUserInfo() {
      try {
        const userInfo = await getUserInfo();
        const first_name = userInfo.data.first_name;
        setUserName(first_name);
      } catch (error) {
        console.error(error);
        setTimeout(() => navigate("/"), 100);
      }
    }

    fetchUserInfo();
  }, [token, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Backend logout failed:", error);
    } finally {
      contextLogout();
      navigate("/");
    }
  };


  return (
    <div className="hp-container">
      <nav className="nav-bar">
        <a href="/supporthomepage"><div className="title">CogniSphere</div></a>
        <div className="navbar-separator"></div>
        <DarkModeToggle />
        <button className="logout-button" onClick={() => handleLogout() }>LOGOUT</button>
      </nav>
      <div className="inner-box">
        <div className="welcome-message">Welcome, {userName}!</div>
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
