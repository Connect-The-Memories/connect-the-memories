import React, { useState, useEffect } from "react";
import "./WritingExercise.css";
import { useNavigate } from "react-router-dom";
import DarkModeToggle from "../DarkModeToggle";
import { getRandomizedMedia } from "../../api/database";
import { useAuth } from "../../context/AuthContext";
import RequiredGalleryImages from "../RequiredGalleryImages.js"; 

function WritingExercise() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const charLimit = 800;
  const [text, setText] = useState("");
  const [completed, setCompleted] = useState(false);
  const [ready, setReady] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [media, setMedia] = useState(null);
  const [loadingMedia, setLoadingMedia] = useState(false);

   const fetchRandomMedia = async () => {              
    setLoadingMedia(true);                          
    try {                                           
      const res = await getRandomizedMedia();        
      if (res.status === 200 && res.data.media?.length) {
        setMedia(res.data.media[0]);                  
      }
    } catch (err) {
      console.error("Fetch error:", err);            
    } finally {
      setLoadingMedia(false);                      
    }
  };

  const handleChange = (e) => {
    setText(e.target.value);
  };

  // basic spam check 
  const isSpam = (text) => {
    const words = text.split(/\s+/);
    const uniqueWords = new Set(words);

    const repeatedChars = /(.)\1{5,}/;
    if (repeatedChars.test(text)) return true;

    if (uniqueWords.size / words.length < 0.3) return true;

    const specialChars = text.replace(/[a-zA-Z0-9\s]/g, "");
    if (specialChars.length / text.length > 0.4) return true;

    const gibberishPatterns = ["asdf", "qwer", "zxcv", "1234", "7777", "0000"];
    for (let pattern of gibberishPatterns) {
      if (text.toLowerCase().includes(pattern)) return true;
    }

    return false;
  };

  // handle Submission
  const handleSubmit = () => {
    if (text.trim().length < charLimit) return;

    if (isSpam(text)) {
      alert("Your text appears to be spam. Please write a meaningful response.");
      return;
    }

    setCompleted(true);

    // send the entry to the backend here (e.g., save to user’s journal).
    // e.g., saveJournalEntry(text);
  };

  useEffect(() => {
    if (!token) { setTimeout(() => navigate("/"), 100); return; }

    /* Countdown logic */
    if (countdown === null) return;
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
    /* countdown reached 0 → ready */
    setCountdown(null);
    setReady(true);
    fetchRandomMedia();                               // ← NEW  (initial fetch)
  }, [countdown]);

  if (completed) {
    return (
      <div className="addpage-container">
        <nav className="nav-bar">
          <div className="title">CogniSphere</div>
          <div className="navbar-separator"></div>
          <DarkModeToggle />
          <button className="logout-button" onClick={() => navigate("/exerciseselection")}>
            ← Back
          </button>
        </nav>

        <div className="inner-box">
          <p className="epic-text">Thank You for Sharing!</p>
          <p className="epic-text">Your writing has been saved to your journal.</p>
          <p className="epic-text">We hope reflecting on these memories helped you feel more connected.</p>

          <div className="completion-button">
            <button
              onClick={() => navigate("/journal")}
              className="epic-button"
            >
              View My Journal
            </button>
            <button
              onClick={() => navigate("/exerciseselection")}
              className="epic-button"
            >
              More Exercises
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
  <RequiredGalleryImages min={20}>
    <div className="writing-exercise-page">
      <nav className="nav-bar">
        <a href="/primaryhomepage"><div className="title">CogniSphere</div></a>
        <div className="navbar-separator"></div>
        <DarkModeToggle />
        <button className="logout-button" onClick={() => navigate("/exerciseselection")}>
          ← Back
        </button>
      </nav>

      {countdown !== null ? (
        <div className="countdown-screen">
          <h1>{countdown}</h1>
        </div>
      ) : !ready ? (
        <div className="inner-box">
          <p className="instructions-title">Instructions</p>
          <p className="writing-instructions-text">
            Take a moment to reflect on what the following image brings to mind.
            Does it remind you of a special time in your life? A person you cherish? A place you've been?
            Share your thoughts, emotions, or memories in your own words.
            Writing can help strengthen your mind and keep your memories alive.
            Please write at least <strong>{charLimit}</strong> characters (10-12 sentences) to complete the exercise.
            Press the randomize image button to see a new image if you need more inspiration.
          </p>
          <p className="writing-instructions-text">
            There’s no right or wrong—just let your thoughts flow. Whether it’s a detailed story, a feeling, or even a small moment,
            everything you write is meaningful. Take your time, and enjoy the process!
          </p>
          <p>
            Click "Next" when you're ready to see the image and complete the exercise!
          </p>
          <button className="start-button" onClick={() => setCountdown(3)}>
            Next
          </button>
        </div>
      ) : (
        <div className="writing-exercise-container">
          <div className="media-container">
            {loadingMedia ? (
              <p>Loading media…</p>
            ) : media ? (
              <>
                <img
                  src={media.signed_url}
                  alt="Memory Prompt"
                  className="media-image"
                />
                <button
                  className="randomize-button"
                  onClick={() => fetchRandomMedia()}
                  disabled={loadingMedia}
                >
                  ⟳ Randomize Image
                </button>
              </>
            ) : (
              <p className="no-media-text">No media available.</p>
            )}
          </div>
          <div className="writing-section">
            <textarea
              value={text}
              onChange={handleChange}
              placeholder="Start writing here..."
              rows="10"
            ></textarea>

            <p>Write about the memory or feelings evoked by the media. Please write at least <strong>{charLimit}</strong> characters (roughly 10-12 sentences) to complete the exercise.</p>

            <div className="char-count">
              {text.trim().length} / {charLimit} characters
            </div>

            <button
              className="submit-button"
              onClick={handleSubmit}
              disabled={text.trim().length < charLimit}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
    </RequiredGalleryImages>
  );
}

export default WritingExercise;
