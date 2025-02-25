import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateAccount.css";
import { createAccount } from "../api/auth";
import CogniSphereIcon from '../assets/cognisphere-icon-white.png';

function CreateAccount() {
  const navigate = useNavigate();
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthday, setBirthday] = useState("");
  const [accountType, setAccountType] = useState("main");
  const [error, setError] = useState("");

  const handleCreateAccount = async () => {
    if (!email || !password || !birthday) {
      setError("All fields are required!");
      return;
    }
    setError("");

    try {
      const respone = await createAccount(email, password, birthday, accountType);
      // alert("Account created successfully!"); // This alert is not necessary and might want to be removed.
      navigate("/");
    } catch (error) {
      setError(error.response.data.message);

      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred while creating your account. Please try again.");
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleCreateAccount();
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
          <div className="welcome-back">Create an Account</div>

          <div className="name-input-container">
            <input
              type="text"
              placeholder="First Name"
              className="name-input"
              value={fname}
              onChange={(e) => setFname(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <input
              type="text"
              placeholder="Last Name"
              className="name-input"
              value={lname}
              onChange={(e) => setLname(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <input
            type="email"
            placeholder="Email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <input
            type="date"
            className="login-input"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <select
            className="login-input"
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            onKeyDown={handleKeyDown}
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
