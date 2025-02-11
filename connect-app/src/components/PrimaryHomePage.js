import { useNavigate } from "react-router-dom";
import "./PrimaryHomePage.css"; 
import galleryIcon from '../assets/gallery-icon.jpg';
import exerciseIcon from '../assets/exercise-icon.jpg';
import friendIcon from '../assets/friend-icon.jpg';

function PrimaryHomePage() {
  const navigate = useNavigate();

  const userName = "Bruce"

  return (
    <div className="hp-container">
      <nav className="top-bar">
        <div className="title">CogniSphere</div>
        <button className="logout-button" onClick={() => navigate("/")}>LOGOUT</button>
      </nav>
      <div className="inner-box">
        <div className="inner-box-top-row">
          <button className="progress-button" onClick={() => navigate("/progress")}>View Progress</button>
        </div>
        <div className="action-buttons-container">
          <div className="button-container">
            <button className=" action-button gallery-button" onClick={() => navigate("/gallery")}>
              <img src={galleryIcon} alt="gallery icon" className="action-button-icon"/>
            </button>
            <p className="action-buttons-text">Media Gallery</p>
          </div>
          <div className="button-container">
            <button className="action-button exercises-button" onClick={() => navigate("/exercises")}>
              <img src={exerciseIcon} alt="exercise-icon" className="action-button-icon"/></button>
            <p className="action-buttons-text">Exercises</p>
          </div>
          <div className="button-container">
            <button className="action-button add-button" onClick={() => navigate("/addsupport")}>
              <img src={friendIcon} alt="friends icon" className="action-button-icon"/></button>
            <p className="action-buttons-text">Add Friends or Family</p>
          </div>
        </div>
      <div className="welcome-message">Welcome, {userName}</div>
    </div>
  </div>
  );
}

export default PrimaryHomePage;
