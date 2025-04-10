import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";
import './LandingPage.css';

import { login } from '../api/auth';
import CogniSphereIconDark from '../assets/cognisphere-icon-white.png';
import CogniSphereIconLight from '../assets/cognisphere-icon-black.png';

function LandingPage() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const currentTheme = document.querySelector("body").getAttribute("data-theme");
    setTheme(currentTheme);

    // Listen for future theme changes if toggle affects body dynamically
    const observer = new MutationObserver(() => {
      const updatedTheme = document.querySelector("body").getAttribute("data-theme");
      setTheme(updatedTheme);
    });

    observer.observe(document.querySelector("body"), {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  // Set icon to appropriate theme version
  const iconSrc = theme === "dark"
    ? CogniSphereIconDark
    : CogniSphereIconLight;

  const handleLogin = async () => {
    if (!userName || !password) {
      setError("All fields are required!");
      return;
    }
    setError("");

    try {
      const response = await login(userName, password);
      const account_type = response.data.account_type;

      if (account_type === "main") {
        setIsLoading(true);
        setTimeout(() => {
          navigate("/primaryhomepage");
        }, 2000);
      } else if (account_type === "support") {
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

    } catch (error) {
      setError(error.response.data.message);

      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred while logging in. Please try again.");
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="container">
      <div className="left-side">
        <img src={iconSrc} alt="CogniSphere Icon" className="landing-page-icon" />
        <h1 className="landing-page-title">CogniSphere testing</h1>
        <div className="landing-pg-theme-toggle">
          <DarkModeToggle />
        </div>
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
                onKeyDown={handleKeyDown}
              />

              <input
                type="password"
                placeholder="Password"
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />

              {error && <p className="error-text">{error}</p>}

              <button className="login-btn" onClick={handleLogin}>Log In</button>
            </>
          )}

          <hr />
          <p className="or-text">OR</p>
          <button className="create-account-btn" onClick={() => navigate("/createAccount")}>
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
