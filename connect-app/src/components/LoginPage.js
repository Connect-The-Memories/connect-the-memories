import React from "react";
import './LoginPage.css';
import { useNavigate } from "react-router-dom"; 

function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="top-right-title"> CogniSphere </div>  
      <div className="login-box">
        <h1>Welcome!</h1>
        <button className="btn" onClick={() => navigate("/loggingIn")}>Log In</button>
        <button className="btn" onClick={() => navigate("/createAccount")}>Create an Account</button>
        <button className="helpbtn" onClick={() => navigate("/help")}>?</button> 
      </div>
    </div>
  );
}

export default LoginPage;
