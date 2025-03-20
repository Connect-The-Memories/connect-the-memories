import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Gallery.css";
import mockUsers from "../mockUsers"; 

function GalleryPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("photos");
  const [photos, setPhotos] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

    if (loggedInUser) {
      const foundUser = mockUsers.find(user => user.email === loggedInUser.email);
      if (foundUser) {
        setPhotos(foundUser.photos || []);
        setMessages(foundUser.messages || []);
      }
    }
  }, []);

  return (
    <div className="gallery-container">
      <nav className="top-bar">
        <div className="title">CogniSphere</div>
        <button className="logout-button" onClick={() => navigate("/primaryhomepage")}>
          ← Back
        </button>
      </nav>

      <div className="toggle-bar">
        <button 
          className={`toggle-button ${activeTab === "photos" ? "active" : ""}`} 
          onClick={() => setActiveTab("photos")}
        >
          Photos/Videos
        </button>
        <button 
          className={`toggle-button ${activeTab === "messages" ? "active" : ""}`} 
          onClick={() => setActiveTab("messages")}
        >
          Messages
        </button>
      </div>

      <div className="gallery-content">
        {activeTab === "photos" ? (
          photos.length > 0 ? (
            <div className="photo-grid">
              {photos.map((photo, index) => (
                <div key={index} className="photo-item">
                  <img src={photo.url} alt="Uploaded media" className="photo-image" />
                  <p className="uploaded-by">Uploaded by: {photo.uploadedBy}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-message">No photos uploaded yet</p>
          )
        ) : (
          messages.length > 0 ? (
            <div className="message-list">
              {messages.map((message, index) => (
                <div key={index} className="message-item">
                  <p>{message.text}</p>
                  <p className="uploaded-by">Uploaded by: {message.uploadedBy}</p>
                  <p className="date">Date: {message.date}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-message">No messages uploaded yet</p>
          )
        )}
      </div>
    </div>
  );
}

export default GalleryPage;
