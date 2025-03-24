import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UploadPage.css";
import { uploadMessages, uploadMedia, getLinkedAccounts } from "../api/database";

function UploadPage() {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("Messages")
    const [primaryUsers, setPrimaryUsers] = useState([]); // List of linked primary users
    const [selectedPrimary, setSelectedPrimary] = useState(""); // Selected primary user
    const [currMsg, setcurrMsg] = useState(""); // Current typed message in text area
    const [messages, setMessages] = useState([]); // Array of messages
    const [selectedFiles, setSelectedFiles] = useState([]); // Array of files (images/videos)

    // Get list of linked users
    useEffect(() => {
        const fetchLinkedAccounts = async () => {
            try {
                const response = await getLinkedAccounts();
                const user_names = response.data.linked_user_names;
                setPrimaryUsers(user_names);
            } catch (error) {
                console.error(error);
            }
        };
        fetchLinkedAccounts();
    }, []);

    // Handle primary user selection
    const handlePrimaryChange = (e) => {
        setSelectedPrimary(e.target.value);
    };

    // Handle adding another message input
    const addMessageField = () => {
        setMessages([...messages, currMsg]);
        setcurrMsg("")
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const files = Array.from(event.dataTransfer.files); // Drag-and-drop files
        addFilesFromDrop(files);
    };

    const addFilesFromDrop = (files) => {
        const filesWithPreview = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
            description: "",
            date: "",
        }));
        setSelectedFiles((prevFiles) => [...prevFiles, ...filesWithPreview]);
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files); // Convert FileList to array
        const filesWithPreview = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file), // Generate preview URL
            description: "",
            date: "",
        }));

        setSelectedFiles((prevFiles) => [...prevFiles, ...filesWithPreview]);
    };

    // Handle file description change
    const handleFileDescriptionChange = (index, value) => {
        const updatedFiles = [...selectedFiles];
        updatedFiles[index].description = value;
        setSelectedFiles(updatedFiles);
    };

    const handleFileDateChange = (index, value) => {
        const updatedFiles = [...selectedFiles];
        updatedFiles[index].date = value;
        setSelectedFiles(updatedFiles);
    };

    // Handle upload
    const handleUpload = async () => {
        // Alert if no primary user is selected.
        if (!selectedPrimary) {
            alert("Please select a primary user.");
            return;
        }

        // Alert if no messages have been drafted.
        if (activeTab === "Messages" && messages.length === 0) {
            alert("Please add a message to upload.");
            return;
        }

        // Alerr if no photos/videos have been drafted.
        if (activeTab === "Photos/Videos" && selectedFiles.length === 0) {
            alert("Please add a file to upload.");
            return;
        }

        // Alert if photos/videos are missing descriptions.
        selectedFiles.forEach((fileObj) => {
            if (!fileObj.description) {
                alert("Please add a description for every photo/video.")
                return;
            }
        });

        try {
            if (activeTab === "Messages") {
                const response = await uploadMessages(messages, selectedPrimary);
                console.log(response);
                alert("Messages uploaded successful!");
            } else {
                const formData = new FormData();
                formData.append("main_user_name", selectedPrimary);
                selectedFiles.forEach(({ file, description, date }) => {
                    formData.append(`files`, file);
                    formData.append(`descriptions`, description);
                    formData.append(`dates`, date);
                });
                console.log(formData);
                const response = await uploadMedia(formData);
            }
        } catch (error) {
            console.error(error);
            alert("Error occured while uploading.");
        }
    };

    return (
        <div className="upload-container">
            <nav className="nav-bar">
                <a href="/supporthomepage"><div className="title">CogniSphere</div></a>
                <button className="logout-button" onClick={() => navigate("/supporthomepage")}>← Back</button>
            </nav>
            <div className="upload-inner-box">

                {/* Left Side: configure primary user and media type */}
                <div className="upload-left-side">

                    <h2 className="upload-title-text">Upload Media</h2>
                    {/* Primary User Selection */}
                    <label className="upload-left-text">Select a Primary User to upload media for:</label>
                    <select
                        className="primary-dropdown"
                        value={selectedPrimary}
                        onChange={handlePrimaryChange}
                    >
                        <option value="">Select a Primary User</option>
                        {primaryUsers.map((name) => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                    </select>

                    {/* Toggle Media Type */}
                    <label className="upload-left-text">Media type:</label>
                    <div className="toggle-bar">
                        <button
                            className={`toggle-button ${activeTab === "Messages" ? "active" : ""}`}
                            onClick={() => setActiveTab("Messages")}
                        >
                            Messages
                        </button>
                        <button
                            className={`toggle-button ${activeTab === "Photos/Videos" ? "active" : ""}`}
                            onClick={() => setActiveTab("Photos/Videos")}
                        >
                            Photos/Videos
                        </button>
                    </div>

                </div>

                {/* Right Side: upload area */}
                <div className="upload-right-side">
                    {/* Message Input Area */}
                    {activeTab === "Messages" ? (
                        <div className="upload-preview">
                            <textarea
                                className="upload-message-input"
                                placeholder="Type a message..."
                                value={currMsg}
                                onChange={(e) => setcurrMsg(e.target.value)}
                            />
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <div style={{ color: 'black', fontSize: '24px', marginTop: '10px' }}>Drafts:</div>
                                <button
                                    className="add-another-button"
                                    onClick={addMessageField}
                                >
                                    + Add
                                </button>
                            </div>
                            <div className="media-preview-box">
                                {[...messages].reverse().map((msg, index) => (
                                    <p key={index} className="msg-preview-text">{msg}</p>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* Photo/Video Input Area */
                        <div className="upload-preview">
                            <div
                                className="drag-drop-area"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleDrop}
                            >
                                <p className="drag-drop-text">Drag & Drop files here or click to browse</p>
                                <input type="file" multiple className="hidden" onChange={handleFileChange} />
                            </div>
                            <div style={{ color: 'black', fontSize: '24px', marginTop: '10px', textAlign: 'start' }}>Drafts:</div>
                            {/* File Preview with Description Fields */}
                            <div className="media-preview-box">
                                {[...selectedFiles].reverse().map((fileObj, reverseIndex) => {
                                    const originalIndex = selectedFiles.length - 1 - reverseIndex;
                                    return (
                                        <div key={originalIndex} className="file-preview-item">
                                            <div className="file-preview-left">
                                                {fileObj.file.type.startsWith("image/") ? (
                                                    <img src={fileObj.preview} alt="Preview" className="image-preview" />
                                                ) : (
                                                    <video src={fileObj.preview} controls className="video-preview" />
                                                )}
                                                <p className="filename-text">{fileObj.file.name}</p>
                                            </div>
                                            <div className="file-preview-right">
                                                <textarea
                                                    type="text"
                                                    className="file-description-input"
                                                    placeholder="Please write a description of the media..."
                                                    value={fileObj.description}
                                                    onChange={(e) => handleFileDescriptionChange(originalIndex, e.target.value)}
                                                />
                                                <div className="media-date-area">
                                                    <p className="media-date-text">Approximate date of media:</p>
                                                    <input
                                                        type="date"
                                                        className="media-date-input"
                                                        value={fileObj.date || ""}
                                                        onChange={(e) => handleFileDateChange(originalIndex, e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        className="upload-button"
                        onClick={handleUpload}
                    >
                        Upload All
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UploadPage;