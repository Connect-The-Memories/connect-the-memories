import { useNavigate } from "react-router-dom";
import "./HomePage.css";

import galleryIcon from '../assets/gallery-icon-white.png';
import exerciseIcon from '../assets/exercise-icon-white.png';
import friendIcon from '../assets/friend-icon-white.png';
import { logout } from "../api/auth";

function PrimaryHomePage() {
  const navigate = useNavigate();

  const userName = "Bruce"

  return (
    <div className="hp-container">
      <nav className="nav-bar">
        <a href="/"><div className="title">CogniSphere</div></a>
        <button className="logout-button" onClick={ async () => {
          await logout()
          navigate("/")
          }}>LOGOUT</button>
      </nav>
      <div className="inner-box">
        <div className="welcome-message">Welcome, {userName}!</div>
        <div className="inner-box-top-row">
          <div style={{ width: "27vw" }}></div>
          <button className="top-row-button" onClick={() => navigate("/stats")}>Exercise Statistics</button>
          <button className="top-row-button" onClick={() => navigate("/journal")}>Journal</button>
        </div>
        <div className="action-buttons-container">
          <div className="button-container">
            <button className=" action-button" onClick={() => navigate("/gallery")}>
              <img src={galleryIcon} alt="gallery icon" className="action-button-icon" />
              <p className="action-buttons-text">Media Gallery</p>
            </button>
          </div>
          <div className="button-container">
            <button className="action-button" onClick={() => navigate("/exerciseselection")}>
              <img src={exerciseIcon} alt="exercise-icon" className="action-button-icon" />
              <p className="action-buttons-text">Exercises</p>
            </button>
          </div>
          <div className="button-container">
            <button className="action-button" onClick={() => navigate("/addsupport")}>
              <img src={friendIcon} alt="friends icon" className="action-button-icon" />
              <p className="action-buttons-text">Add Friends or Family</p>
            </button>
          </div>
        </div>
      </div>
    </div >
  );
}

export default PrimaryHomePage;
