import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

import galleryIcon from '../assets/gallery-icon-black.png';
import exerciseIcon from '../assets/exercise-icon-black.png';
import friendIcon from '../assets/friend-icon-black.png';
import { logout, getUserInfo } from "../api/auth";

function PrimaryHomePage() {
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
        <button className="logout-button" onClick={async () => {
          await logout()
          navigate("/")
        }}>LOGOUT</button>
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
