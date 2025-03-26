import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Gallery.css";
import { useMedia } from "./MediaContext";

// TODO: Eventually implement pagination for messages and img/vid to avoid performance issues
function GalleryPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("photos");

  const { photos, messages, fetchMediaData } = useMedia();

  useEffect(() => {
    fetchMediaData();
  }, []);

  return (
    <div className="gallery-container">
      <nav className="nav-bar">
        <div className="title">CogniSphere</div>
        <button className="logout-button" onClick={() => navigate("/primaryhomepage")}>
          ← Back
        </button>
      </nav>

      <div className="toggle-container">
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
                  <img src={photo.signed_url} alt={`Uploaded by ${photo.support_user_name}`} className="photo-image" />
                  <p className="uploaded-by">Uploaded by: {photo.support_user_name}</p>
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
                  <p>{message.message}</p>
                  <p className="uploaded-by">Uploaded by: {message.support_full_name}</p>
                  <p className="date">Date: {message.timestamp}</p>
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
