import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateAccount.css";

function CreateAccount() {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState("main");

  return (
    <div className="create-account-container">
      <div className="top-right-title"> CogniSphere </div>
      <div className="create-account-box">
        <button className="exit-button" onClick={() => navigate("/")}>X</button>
        <h2>Create an Account</h2>

        <input type="email" placeholder="Email" className="input-field" />
        <input type="password" placeholder="Password" className="input-field" />
        <input type="date" className="input-field" />

        <select 
          className="input-field" 
          value={accountType} 
          onChange={(e) => setAccountType(e.target.value)}
        >
          <option value="main">Main User</option>
          <option value="support">Support User</option>
          <option value="both"> Both </option>
        </select>

        <button className="create-button">Create Account</button>
      </div>
    </div>
  );
}

export default CreateAccount;
