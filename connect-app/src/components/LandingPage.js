import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './LandingPage.css';

import mockUsers from "../mockUsers";
import CogniSphereIcon from '../assets/cognisphere-icon-white.png';

function LandingPage() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    const storedUsers = JSON.parse(sessionStorage.getItem("users")) || [];
    const allUsers = [...mockUsers, ...storedUsers];

    const foundUser = allUsers.find(user => user.email === userName && user.password === password);

    if (foundUser) {

      sessionStorage.setItem("loggedInUser", JSON.stringify(foundUser)); // stores user in session storage 

      if (foundUser.type === "main") {
        setIsLoading(true);
        setTimeout(() => {
          navigate("/primaryhomepage")
        }, 2000);
      } else if (foundUser.type === "support") {
        setIsLoading(true);
        setTimeout(() => {
          navigate("/supporthomepage");
        }, 2000);
      } else {
        setIsLoading(true);
        setTimeout(() => {
          navigate("/primaryhomepage");
        }, 2000);
      }
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="container">
      <div className="left-side">
        <img src={CogniSphereIcon} alt="CogniSphere Icon" className="landing-page-icon" />
        <h1 className="landing-page-title">CogniSphere</h1>
      </div>
      <div className="right-side">
        <div className="login-box">
          <div className="welcome-back">Welcome!</div>

          {isLoading ? (
            <p className="loading-text">Logging in...</p>
          ) : (
            <>
              <input
                type="email"
                placeholder="Email"
                className="login-input"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {error && <p className="error-text">{error}</p>}

              <button className="login-btn" onClick={handleLogin}>Log In</button>
            </>
          )}

          <hr />
          <p>OR</p>
          <button className="create-account-btn" onClick={() => navigate("/createAccount")}>
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
