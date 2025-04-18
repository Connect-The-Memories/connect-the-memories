import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

import galleryIcon from '../assets/gallery-icon-black.png';
import exerciseIcon from '../assets/exercise-icon-black.png';
import friendIcon from '../assets/friend-icon-black.png';
import { logout, getUserInfo } from "../api/auth";
import { useAuth } from "../context/AuthContext";

function PrimaryHomePage() {
  const navigate = useNavigate();
  const { token, logout: contextLogout } = useAuth();
  const [userName, setUserName] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {

    if (!token) {
      console.log("No token found, redirecting to login.");
      setError("You are not logged in.");
      // Optional: Redirect if no token is found after a brief moment
      // setTimeout(() => navigate("/"), 100);
      return; // Stop the effect if not authenticated
    }

    async function fetchUserInfo() {
      try {
        const userInfo = await getUserInfo();
        const first_name = userInfo.data.first_name;
        setUserName(first_name);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        if (error.response && error.response.status === 401) {
          setError("Authentication failed. Please log in again.");
        } else {
          setError("Could not load user data.");
        }
        setUserName("Guest");
      }
    }

    fetchUserInfo();
  }, [token, navigate]);

  const handleLogout = async () => {
    try {
      // Optional: Call the backend logout endpoint first
      await logout();
    } catch (error) {
      console.error("Backend logout failed:", error);
      // Decide if you still want to log out frontend if backend fails
      // Often, you still want to clear the frontend state
    } finally {
      // CRITICAL: Call context logout to clear token state and Axios header
      contextLogout();
      // Navigate to landing/login page
      navigate("/");
    }
  };


  return (
    <div className="hp-container">
      <nav className="nav-bar">
        <a href="/primaryhomepage"><div className="title">CogniSphere</div></a>
        <button className="logout-button" onClick={handleLogout}>LOGOUT</button>
      </nav>
      <div className="inner-box">
        <div className="welcome-message">Welcome, {userName}!</div>
        <div className="action-buttons-container">
          <div className="button-container">
            <button className=" action-button gallery-button" onClick={() => navigate("/gallery")}>
              <img src={galleryIcon} alt="gallery icon" className="action-button-icon" />
              <p className="action-buttons-text">Media Gallery</p>
            </button>
          </div>
          <div className="button-container">
            <button className="action-button exercise-button" onClick={() => navigate("/exerciseselection")}>
              <img src={exerciseIcon} alt="exercise-icon" className="action-button-icon" />
              <p className="action-buttons-text">Exercises</p>
            </button>
          </div>
          <div className="button-container">
            <button className="action-button add-button" onClick={() => navigate("/addsupport")}>
              <img src={friendIcon} alt="friends icon" className="action-button-icon" />
              <p className="action-buttons-text">Add Friends or Family</p>
            </button>
          </div>
        </div>

        <div className="hp-sub-row">
          <button className="hp-sub-button" onClick={() => navigate("/journal")}>Journal</button>
          <button className="hp-sub-button" onClick={() => navigate("/stats")}>Exercise Statistics</button>
          <button className="hp-sub-button" onClick={() => navigate("/managesupport")}>Manage Support System</button>
        </div>

      </div>
    </div >
  );
}

export default PrimaryHomePage;
