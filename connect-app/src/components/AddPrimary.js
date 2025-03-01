import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddPrimarySupport.css";
import { validateOTP } from "../api/database";

function AddPrimary() {
    const navigate = useNavigate();

    const [code, setCode] = useState("");

    const handleConnectUser = async () => {
        try{
            const response = await validateOTP(code);
            const msg = response.data.msg;
        } catch (error) {
            // Empty for now
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleConnectUser();
        }
      };

    return (
        <div className="addpage-container">
            <nav className="nav-bar">
                <a href="/"><div className="title">CogniSphere</div></a>
                <button className="logout-button" onClick={() => navigate("/supporthomepage")}>← Back</button>
            </nav>
            <div className="addpage-inner-box">
                <div className="addpage-title-text">Add a Primary User</div>
                <p className="addpage-text">Enter the 6-digit code from your Primary User:</p>
                <input
                    type="text"
                    placeholder="Enter code here"
                    className="add-code-input"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button onClick={handleConnectUser} className="generate-button">Connect!</button>
            </div>
        </div >
    );
}

export default AddPrimary;