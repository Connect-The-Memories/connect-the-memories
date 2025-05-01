import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Gallery.css";
import { useMedia } from "./MediaContext";
import { useAuth } from "../context/AuthContext";
import DarkModeToggle from "./DarkModeToggle";

// TODO: Eventually implement pagination for messages and img/vid to avoid performance issues
function GalleryPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("photos");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const { token } = useAuth();
  const { photos, messages, fetchMediaData } = useMedia();

  useEffect(() => {
    if (!token) {
      setTimeout(() => navigate("/"), 100);
      return;
    }
    fetchMediaData();
  }, []);

  const openPhotoModal = (photo) => {
    setSelectedPhoto(photo);
    setShowAnalysis(false);
  };

  const closePhotoModal = () => {
    setSelectedPhoto(null);
    setShowAnalysis(false);
  };

  useEffect(() => {
    console.table(photos);
  }, [photos]);

  return (
    <div className="gallery-container">
      <nav className="nav-bar">
        <a href="/primaryhomepage"><div className="title">CogniSphere</div></a>
        <div className="navbar-separator"></div>
        <DarkModeToggle />
        <button className="logout-button" onClick={() => navigate("/primaryhomepage")}>← Back</button>
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
                  <img
                    src={photo.signed_url}
                    alt={`Uploaded by ${photo.support_user_name}`}
                    className="photo-image"
                    onClick={() => openPhotoModal(photo)}
                  />
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
                  <p className="message-text">{message.message}</p>
                  <p className="uploaded-by">Uploaded by: {message.support_full_name}</p>
                  <p className="message-date">Date: {message.timestamp}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-message">No messages uploaded yet</p>
          )
        )}
      </div>

      {selectedPhoto && (
        <div className="modal-overlay" onClick={closePhotoModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedPhoto.signed_url} alt="Enlarged" className="enlarged-photo" />

            <button className="close-button" onClick={closePhotoModal}>
              Close
            </button>

            <button
              className="analysis-button"
              onClick={() => setShowAnalysis((prev) => !prev)}
              aria-label="Toggle analysis"
            >
              ?
            </button>

            {showAnalysis && selectedPhoto.quick_access && (
              <div className="analysis-panel">
                <p><strong>What is going on in this memory?:</strong> {selectedPhoto.quick_access.probable_activities.length > 0 ? selectedPhoto.quick_access.probable_activities.join(', ') : 'No answer'}</p>
                <p><strong>What is the scenery of this memory?:</strong> {selectedPhoto.quick_access.probable_scenes.length > 0 ? selectedPhoto.quick_access.probable_scenes.join(', ') : 'No answer'}</p>
                <p><strong>Does this memory have people?:</strong> {selectedPhoto.quick_access.has_people ? 'Yes' : 'No'}</p>
                <p><strong>What is the location of this memory?:</strong> {selectedPhoto.quick_access.location || 'No answer'}</p>
                <p><strong>Top labels associated with this memory:</strong> {selectedPhoto.quick_access.top_labels.length > 0 ? selectedPhoto.quick_access.top_labels.join(', ') : 'No answer'}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default GalleryPage;
