import React from "react";
import './LoginPage.css';

function LoginPage() {
  return (
    <div className="container">
      <div className="top-right-title"> Connect The Memories </div>  
      <div className="login-box">
        <h1>Welcome!</h1>
        <button className="btn">Log In</button>
        <button className="btn">Create an Account</button>
        <div className="helpbtn"> ? </div> 
      </div>
    </div>
  );
}

export default LoginPage;
