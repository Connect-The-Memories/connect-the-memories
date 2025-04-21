import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";
import { createAccount } from "../api/auth";
import { useAuth } from "../context/AuthContext";


import CogniSphereIconDark from '../assets/cognisphere-icon-white.png';
import CogniSphereIconLight from '../assets/cognisphere-icon-black.png';
import "./CreateAccount.css";

function CreateAccount() {
  const navigate = useNavigate();
  const { login: contextLogin } = useAuth();
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState({
    length: false,
    lower:  false,
    upper:  false,
    digit:  false,
    special:false,
  });
  const [birthday, setBirthday] = useState("");
  const [accountType, setAccountType] = useState("main");
  const [error, setError] = useState("");
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

  useEffect(() => {
    const pwd = password;
    setPasswordValid({
      length: pwd.length >= 8,
      lower:  /[a-z]/.test(pwd),
      upper:  /[A-Z]/.test(pwd),
      digit:  /\d/.test(pwd),
      special:/[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    });
  }, [password]);  

  // Set icon to appropriate theme version
  const iconSrc = theme === "dark"
    ? CogniSphereIconDark
    : CogniSphereIconLight;

  const handleCreateAccount = async () => {
    if (!email || !password || !birthday) {
      setError("All fields are required!");
      return;
    }
    setError("");

    try {
      const response = await createAccount(fname, lname, email, password, birthday, accountType);

      if (response.data && response.data.idToken) {
        const idToken = response.data.idToken;
        const account_type = response.data.account_type;

        contextLogin(idToken, { accountType: account_type });

        if (account_type === "main") {
          // setIsLoading(true);
          setTimeout(() => {
            navigate("/primaryhomepage");
          }, 2000);
        } else if (account_type === "support") {
          // setIsLoading(true);
          setTimeout(() => {
            navigate("/supporthomepage");
          }, 2000);
        } else {
          // setIsLoading(true);
          setTimeout(() => {
            navigate("/primaryhomepage");
          }, 2000);
        }
      }

    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(`Account Creation failed: ${error.response.data.message}`);
      } else if (error.request) {
         setError("Account Creation failed: No response received from server.");
      }
      else {
        setError("An error occurred during login. Please try again.");
      }
      console.error("Account Creation API error:", error);
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
        <img src={iconSrc} alt="CogniSphere Icon" className="landing-page-icon" />
        <h1 className="landing-page-title">CogniSphere</h1>
        <div className="theme-toggle">
          <DarkModeToggle />
        </div>
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
          <div className="password-requirements">
            <p>Password must include:</p>
            <ul>
              <li className={passwordValid.length  ? "valid" : "invalid"}>
                At least 8 characters
              </li>
              <li className={passwordValid.lower   ? "valid" : "invalid"}>
                A lowercase letter
              </li>
              <li className={passwordValid.upper   ? "valid" : "invalid"}>
                An uppercase letter
              </li>
              <li className={passwordValid.digit   ? "valid" : "invalid"}>
                A digit
              </li>
              <li className={passwordValid.special ? "valid" : "invalid"}>
                A special character (!@#$…)
              </li>
            </ul>
          </div>
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

          <a href="/" className="back-to-login">← Back to Login</a>
        </div>
      </div>
    </div >
  );
}

export default CreateAccount;
