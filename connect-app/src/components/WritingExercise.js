import React, { useState } from "react";
import "./WritingExercise.css";
import { useNavigate } from "react-router-dom";

function WritingExercise() {
  const navigate = useNavigate();
  const charLimit = 800; 
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

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
  );
}

export default WritingExercise;
