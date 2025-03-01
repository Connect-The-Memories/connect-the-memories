import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddPrimarySupport.css";
import { generateOTP } from "../api/database";

function AddSupport() {
    const navigate = useNavigate();

    const [randomCode, setRandomCode] = useState('');

    const handleGenerateCode = async () => {
        try{
            const response = await generateOTP();
            const code = response.data.otp;
            setRandomCode(code);
        } catch (error) {
            // Empty for now
        }
    };


    return (
        <div className="addpage-container">
            <nav className="nav-bar">
                <a href="/"><div className="title">CogniSphere</div></a>
                <button className="logout-button" onClick={() => navigate("/primaryhomepage")}>← Back</button>
            </nav>
            <div className="addpage-inner-box">
                <div className="addpage-title-text">Add a Support User</div>
                <p className="addpage-text">Click the button below to generate a random 6-digit code.</p>
                <p className="addpage-text">Show this code to a friend or family member to add them as a support user!</p>
                {randomCode ? (
                    <div className="random-code-text">
                        {randomCode}
                    </div>
                ) : (<div className="random-code-placeholder">XXXXXX</div>)}
                <button onClick={handleGenerateCode} className="generate-button">Generate Random Code</button>
            </div>
        </div >
    );
}

export default AddSupport;