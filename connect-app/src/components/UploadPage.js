import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UploadPage.css";
import { uploadMessages, uploadMedia, getLinkedAccounts } from "../api/database";
import { useAuth } from "../context/AuthContext";
import trashIcon from '../assets/trash-can.png';
import DarkModeToggle from "./DarkModeToggle";
import Alert from "./Alert";

function UploadPage() {
    const navigate = useNavigate();
    const { token } = useAuth();

    const [activeTab, setActiveTab] = useState("Messages")
    const [primaryUsers, setPrimaryUsers] = useState([]); // List of linked primary users
    const [selectedPrimary, setSelectedPrimary] = useState(""); // Selected primary user
    const [currMsg, setcurrMsg] = useState(""); // Current typed message in text area
    const [messages, setMessages] = useState([]); // Array of messages
    const [selectedFiles, setSelectedFiles] = useState([]); // Array of files (images/videos)
    const charLimit = 150; // ~3 sentences; min length of media description
    const [showAlert, setShowAlert] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");
    const [alertMsg, setAlertMsg] = useState("");


    // Get list of linked users
    useEffect(() => {

        if (!token) {
            setTimeout(() => navigate("/"), 100);
            return;
        }

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
    }, [token, navigate]);

    // Handle primary user selection
    const handlePrimaryChange = (e) => {
        setSelectedPrimary(e.target.value);
    };

    // Handle adding another message input
    const addMessageField = () => {
        setMessages([...messages, currMsg]);
        setcurrMsg("")
    };

    const deleteDraft = (idx) => {
        if (activeTab === "Messages") {
            const reversedMessages = [...messages].reverse();
            reversedMessages.splice(idx, 1); // remove the item
            setMessages(reversedMessages.reverse()); // restore original order
        } else {
            const reversedFiles = [...selectedFiles].reverse();
            reversedFiles.splice(idx, 1); // remove the item
            setSelectedFiles(reversedFiles.reverse()); // restore original order
        }
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
            setAlertTitle("Could Not Upload Media");
            setAlertMsg("Please select a primary user.");
            setShowAlert(true);
            return;
        }

        // Alert if no messages have been drafted.
        if (activeTab === "Messages" && messages.length === 0) {
            setAlertTitle("Could Not Upload Media");
            setAlertMsg("Please add a message to upload.");
            setShowAlert(true);
            return;
        }

        // Alerr if no photos/videos have been drafted.
        if (activeTab === "Photos/Videos" && selectedFiles.length === 0) {
            setAlertTitle("Could Not Upload Media");
            setAlertMsg("Please add a file to upload");
            setShowAlert(true);
            return;
        }

        // Alert if photos/videos are missing descriptions.
        for (const fileObj of selectedFiles) {
            // Check if there's ANY description
            if (!fileObj.description) {
                setAlertTitle("Could Not Upload Media");
                setAlertMsg("Please add a description for every photo/video.");
                setShowAlert(true);
                return;
            }

            // If this is an image, enforce min character count
            if (fileObj.file.type.startsWith("image/")) {
                if (fileObj.description.trim().length < charLimit) {
                    setAlertTitle("Could Not Upload Media");
                    setAlertMsg(`Each image description must be at least ${charLimit} characters. ` +
                        "Please revise your description.");
                    setShowAlert(true);
                    return; // Stop upload
                }
            }
        }

        try {
            if (activeTab === "Messages") {
                const response = await uploadMessages(messages, selectedPrimary);
                // alert(response.data.message);
                setAlertTitle("Upload Successful!");
                setAlertMsg(`Your messages have been uploaded to ${selectedPrimary}'s gallery.`);
                setShowAlert(true);
                setMessages([]);
            } else {
                const formData = new FormData();
                formData.append("main_user_name", selectedPrimary);
                selectedFiles.forEach(({ file, description, date }) => {
                    formData.append(`files`, file);
                    formData.append(`descriptions`, description);
                    formData.append(`dates`, date);
                });
                const response = await uploadMedia(formData);
                // alert(response.data.message);
                setAlertTitle("Upload Successful!");
                setAlertMsg(`Your files have been uploaded to ${selectedPrimary}'s gallery.`);
                setShowAlert(true);
                setSelectedFiles([])
            }
        } catch (error) {
            console.error(error);
            // alert("Error occured while uploading.");
            setAlertTitle("Upload Failed.");
            setAlertMsg("Error occured while uploading.");
            setShowAlert(true);
        }
    };

    return (
        <div className="upload-container">
            <nav className="nav-bar">
                <a href="/supporthomepage"><div className="title">CogniSphere</div></a>
                <div className="navbar-separator"></div>
                <DarkModeToggle />
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
                                    <div className="msg-preview-item">
                                        <p key={index} className="msg-preview-text">{msg}</p>
                                        <button
                                            className="trash-btn"
                                            onClick={() => deleteDraft(index)}
                                        >
                                            <img className="trash-icon" src={trashIcon} alt="trashcan" />
                                        </button>
                                    </div>
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
                                                    required
                                                />
                                                <div className="char-count">
                                                    {fileObj.description.trim().length} / {charLimit} characters
                                                    <a className="required-text">* Required</a>
                                                </div>
                                                <div className="media-date-area">
                                                    <p className="media-date-text">Approximate date of media:</p>
                                                    <input
                                                        type="date"
                                                        className="media-date-input"
                                                        value={fileObj.date || ""}
                                                        onChange={(e) => handleFileDateChange(originalIndex, e.target.value)}
                                                    />
                                                    <button
                                                        className="trash-btn"
                                                        onClick={() => deleteDraft(reverseIndex)}
                                                    >
                                                        <img className="trash-icon" src={trashIcon} alt="trashcan" />
                                                    </button>
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
            {showAlert && (
                <div>
                    <Alert
                        title={alertTitle}
                        description={alertMsg}
                        show={showAlert}
                        onClose={() => setShowAlert(false)}
                    >
                        <button className="cancel-remove-btn" onClick={() => setShowAlert(false)}>Close</button>
                    </Alert>
                </div>
            )}
        </div>
    );
}

export default UploadPage;