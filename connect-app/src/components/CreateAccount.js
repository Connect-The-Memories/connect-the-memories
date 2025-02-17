import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateAccount.css";
import mockUsers from "../mockUsers";
import CogniSphereIcon from '../assets/cognisphere-icon-white.png';

function CreateAccount() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthday, setBirthday] = useState("");
  const [accountType, setAccountType] = useState("main");
  const [error, setError] = useState("");

  const handleCreateAccount = () => {
    if (!email || !password || !birthday) {
      setError("All fields are required!");
      return;
    }

    const storedUsers = JSON.parse(sessionStorage.getItem("users")) || [];

    const allUsers = [...mockUsers, ...storedUsers];

    if (allUsers.some(user => user.email === email)) {
      setError("Email already in use!");
      return;
    }

    const newUser = { email, password, type: accountType };
    const updatedUsers = [...storedUsers, newUser];

    sessionStorage.setItem("users", JSON.stringify(updatedUsers)); // stores users in session storage

    alert("Account created successfully!");
    navigate("/");
  };

  return (
    <div className="container">
      <div className="left-side">
        <img src={CogniSphereIcon} alt="CogniSphere Icon" className="landing-page-icon" />
        <h1 className="landing-page-title">CogniSphere</h1>
      </div>
      <div className="right-side">
        <div className="login-box">
          <div className="welcome-back">Create an Account</div>

          <input
            type="email"
            placeholder="Email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="date"
            className="login-input"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
          />
          <select
            className="login-input"
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
          >
            <option value="main">Main User</option>
            <option value="support">Support User</option>
            <option value="both"> Both </option>
          </select>

          {error && <p className="error-text">{error}</p>}

          <button className="create-account-btn" onClick={handleCreateAccount}>
            Create an Account
          </button>

          <a href="/" className="back-to-login">BACK TO LOGIN</a>
        </div>
      </div>
    </div >
  );
}

export default CreateAccount;
