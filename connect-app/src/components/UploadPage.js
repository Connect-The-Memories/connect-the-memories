import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UploadPage.css";

import UploadIcon from '../assets/upload-icon-white.png';

function UploadPage() {
    const navigate = useNavigate();

    const [message, setMessage] = useState("");
    const [files, setFiles] = useState([]);

    // Handle file selection
    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    };

    // Handle drag and drop
    const handleDrop = (event) => {
        event.preventDefault();
        const droppedFiles = Array.from(event.dataTransfer.files);
        setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
    };

    const handleSubmit = async () => {
        if (!message && files.length === 0) {
            alert("Please add a message or upload a file.");
            return;
        }

        // const formData = new FormData();
        // formData.append("message", message);
        // files.forEach((file, index) => {
        //     formData.append(`files`, file);
        // });

        // try {
        //     const response = await fetch("/api/upload", {
        //         method: "POST",
        //         body: formData,
        //     });

        //     if (response.ok) {
        //         alert("Upload successful!");
        //         setMessage("");
        //         setFiles([]);
        //     } else {
        //         alert("Upload failed. Please try again.");
        //     }
        // } catch (error) {
        //     console.error("Error uploading:", error);
        //     alert("Error uploading files.");
        // }
    };


    return (
        <div className="upload-container">
            <nav className="nav-bar">
                <a href="/"><div className="title">CogniSphere</div></a>
                <button className="logout-button" onClick={() => navigate("/supporthomepage")}>← Back</button>
            </nav>
            <div className="upload-inner-box">
                <h2 className="upload-title-text">Upload Messages & Media</h2>

                {/* Message Input */}
                <textarea
                    className="upload-message-input"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />

                {/* Drag & Drop Area */}
                <div
                    className="drag-drop-area"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                >
                    <img src={UploadIcon} className="upload-icon" />
                    <p className="drag-drop-text">Drag & Drop files here or click below to browse device</p>
                    <input type="file" multiple className="file-input" onChange={handleFileChange} />

                </div>

                {/* File Preview */}
                <div className="file-preview-container">
                    {files.map((file, index) => (
                        <p key={index} className="file-preview-text">{file.name}</p>
                    ))}
                </div>

                {/* Submit Button */}
                <button
                    className="upload-button"
                    onClick={handleSubmit}
                >
                    Upload
                </button>
            </div>
        </div>
    );
}

export default UploadPage;
