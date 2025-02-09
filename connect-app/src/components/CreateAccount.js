import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateAccount.css";

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

    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

    if (existingUsers.some(user => user.email === email)) {
      setError("Email already in use!");
      return;
    }

    const newUser = { email, password, type: accountType };
    const updatedUsers = [...existingUsers, newUser];

    localStorage.setItem("users", JSON.stringify(updatedUsers));

    alert("Account created successfully!");
    navigate("/");
  };

  return (
    <div className="create-account-container">
      <div className="top-right-title"> CogniSphere </div>
      <div className="create-account-box">
        <button className="exit-button" onClick={() => navigate("/")}>X</button>
        <h2>Create an Account</h2>

        <input 
          type="email" 
          placeholder="Email" 
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input 
          type="date" 
          className="input-field"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
        />

        <select 
          className="input-field" 
          value={accountType} 
          onChange={(e) => setAccountType(e.target.value)}
        >
          <option value="main">Main User</option>
          <option value="support">Support User</option>
          <option value="both"> Both </option>
        </select>

        {error && <p className="error-text">{error}</p>}

        <button className="create-button" onClick={handleCreateAccount}>Create Account</button>
      </div>
    </div>
  );
}

export default CreateAccount;
