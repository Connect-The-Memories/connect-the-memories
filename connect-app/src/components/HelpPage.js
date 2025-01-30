import React from "react";
import { useNavigate } from "react-router-dom";
import "./HelpPage.css"; 

function HelpPage() {
  const navigate = useNavigate();

  return (
    <div className="help-container">
      <button className="exit-button" onClick={() => navigate("/")}>X</button>
    </div>
  );
}

export default HelpPage;
