import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AddPrimarySupport.css";
import { validateOTP } from "../api/database";
import DarkModeToggle from "./DarkModeToggle";
import { useAuth } from "../context/AuthContext";

function AddPrimary() {
    const navigate = useNavigate();
    const { token } = useAuth();

    const [code, setCode] = useState("");

    useEffect(() => {
        if (!token) {
            setTimeout(() => navigate("/"), 100);
            return;
        }
    }, [token, navigate]);

    const handleConnectUser = async () => {
        try {
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
                <a href="/supporthomepage"><div className="title">CogniSphere</div></a>
                <div className="navbar-separator"></div>
                <DarkModeToggle />
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