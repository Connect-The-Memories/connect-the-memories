import React, { useState, useEffect } from "react";
import "./WritingExercise.css";
import { useNavigate } from "react-router-dom";
import { getRandomizedMedia } from "../../api/database";

function WritingExercise() {
  const navigate = useNavigate();
  const charLimit = 800;
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [ready, setReady] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [media, setMedia] = useState(null);
  const [loadingMedia, setLoadingMedia] = useState(false);

  const handleChange = (e) => {
    setText(e.target.value);
  };

  // spam function
  const isSpam = (text) => {
    const words = text.split(/\s+/);
    const uniqueWords = new Set(words);

    // 1. check if text contains too many repeated characters (e.g., "aaaaaa")
    const repeatedChars = /(.)\1{5,}/;
    if (repeatedChars.test(text)) return true;

    // 2. check if a single word is repeated too often
    if (uniqueWords.size / words.length < 0.3) return true;

    // 3. check for too many special characters
    const specialChars = text.replace(/[a-zA-Z0-9\s]/g, "");
    if (specialChars.length / text.length > 0.4) return true;

    // 4. check for gibberish (keyboard mashing) — crude approach
    const gibberishPatterns = ["asdf", "qwer", "zxcv", "1234", "7777", "0000"];
    for (let pattern of gibberishPatterns) {
      if (text.toLowerCase().includes(pattern)) return true;
    }

    return false;
  };

  const handleSubmit = () => {
    if (text.trim().length < charLimit) return;

    if (isSpam(text)) {
      alert("Your text appears to be spam. Please write a meaningful response.");
      return;
    }

    setSubmitted(true);
    alert("Submission successful!");
  };


  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCountdown(null);
      setReady(true);

      const fetchMedia = async () => {
        setLoadingMedia(true);
        try {
          const res = await getRandomizedMedia();
          const mediaData = res.data;
          console.log(mediaData);
          if (res.status === 200) {
            setMedia(mediaData.media || null);
          } else {
            console.error(mediaData.error || "Failed to load media");
          }
        } catch (err) {
          console.error("Fetch error:", err);
        } finally {
          setLoadingMedia(false);
        }
      };
      fetchMedia();
    }
  }, [countdown]);

  return (
    <div className="writing-exercise-page">
      <nav className="nav-bar">
        <div className="title">CogniSphere</div>
        <button className="logout-button" onClick={() => navigate("/exerciseselection")}>
          ← Back
        </button>
      </nav>

      {countdown !== null ? (
        <div className="countdown-screen">
          <h1>{countdown}</h1>
        </div>
      ) : !ready ? (
        <div className="instructions-screen">
          <h2>Instructions</h2>
          <p>
            Take a moment to reflect on what the following image or video brings to mind.
            Does it remind you of a special time in your life? A person you cherish? A place you've been?
            Share your thoughts, emotions, or memories in your own words.
            Writing can help strengthen your mind and keep your memories alive.
            Please write at least <strong>{charLimit}</strong> characters to complete the exercise.
          </p>
          <p>
            There’s no right or wrong—just let your thoughts flow. Whether it’s a detailed story, a feeling, or even a small moment,
            everything you write is meaningful. Take your time, and enjoy the process!
          </p>
          <p>
            Click "Next" when you're ready to see the image or video and complete the exercise!
          </p>
          <button className="start-button" onClick={() => setCountdown(3)}>
            Next
          </button>
        </div>
      ) : (
        <div className="writing-exercise-container">
          <div className="media-container">
            <div className="media-placeholder">
              <p>[Media Placeholder]</p>
            </div>
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
              disabled={text.trim().length < charLimit || submitted}
            >
              Submit
            </button>

            {submitted && (
              <p className="success-message">
                Exercise completed! Your entry has been saved to your journal.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default WritingExercise;
