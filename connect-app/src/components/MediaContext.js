// src/context/MediaContext.js
import React, { createContext, useState, useEffect } from "react";
import { getMedia, getMessage } from "../api/database";

export const MediaContext = createContext();

export const MediaProvider = ({ children }) => {
  const [photos, setPhotos] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMediaData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch photos/media
        const resMedia = await getMedia();
        if (resMedia.status === 200) {
          setPhotos(resMedia.data.media || []);
        } else {
          setError("Failed to load media");
        }

        // Fetch messages
        const resMessages = await getMessage();
        if (resMessages.status === 200) {
          setMessages(resMessages.data.messages || []);
        } else {
          setError("Failed to load messages");
        }
      } catch (err) {
        console.error("Media fetch error:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchMediaData();
  }, []);

  return (
    <MediaContext.Provider value={{ photos, messages, loading, error }}>
      {children}
    </MediaContext.Provider>
  );
};
