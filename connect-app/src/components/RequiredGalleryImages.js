import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMedia } from "./MediaContext";
import "./RequiredGalleryImages.css";

/**
 * Wrap any exercise: it will render only if the user has
 * `min` or more photos in the gallery. Otherwise it shows
 * a message with a button that jumps to /gallery.
 */
export default function RequireGalleryImages({ min = 20, children }) {
  const navigate          = useNavigate();
  const { photos, fetchMediaData } = useMedia();

  /* make sure photos are loaded */
  useEffect(() => {
    if (photos.length === 0) fetchMediaData();
  }, [photos, fetchMediaData]);

  /* not enough images → block */
  if (photos.length < min) {
    return (
        <div className="gallery‑gate">
          <h2 className="gate‑title">Not enough memories yet</h2>
          <p className="gate‑body">
            Personalized exercises unlock after you’ve uploaded at least{" "}
            <strong>{min}</strong> photos.<br />
            Head over to the gallery, and let your support network know to add more memories!
          </p>
  
          <button
            className="gate‑button"
            onClick={() => navigate("/gallery")}
          >
            Go to Gallery
          </button>
        </div>
      );
  }

  /* requirement met → render the exercise */
  return children;
}
