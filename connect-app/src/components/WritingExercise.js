import React, { useState } from "react";
import "./WritingExercise.css";
import { useNavigate } from "react-router-dom";

function WritingExercise() {
  const navigate = useNavigate();
  const charLimit = 800; 
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [ready, setReady] = useState(false);

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = () => {
    if (text.trim().length >= charLimit) {
      // wait for full implementation 
      setSubmitted(true);
    } 
  };

  return (
    <div className="writing-exercise-container">
      {/* Top Bar */}
      <nav className="top-bar">
        <div className="title">CogniSphere</div>
        <button className="logout-button" onClick={() => navigate("/exerciseselection")}>← Back</button>
      </nav>

      {/* instructions */}
      {!ready ? (
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
            Click "Next" when you're ready to see the image or video. 
          </p>
          <button className="start-button" onClick={() => setReady(true)}>
            Next
          </button>
        </div>
      ) : (
        <div className="writing-exercise-container"> 
          <h2>Daily Writing Exercise</h2>
          {/* Media placeholder */}
          <div className="media-placeholder">
            <p>[Media Placeholder]</p>
          </div>
          <p>
            Write about the memory or feelings evoked by the media. Please write at least{" "}
            <strong>{charLimit}</strong> characters to complete the exercise.
          </p>
          <textarea
            value={text}
            onChange={handleChange}
            placeholder="Start writing here..."
            rows="10"
          ></textarea>
          <div className="char-count">
            {text.trim().length} / {charLimit} characters
          </div>
          <button className="submit-button" onClick={handleSubmit} disabled={text.trim().length < charLimit || submitted}>
            Submit
          </button>
          {submitted && (
            <p className="success-message">
              Exercise completed! Your entry has been saved to your journal.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default WritingExercise;
