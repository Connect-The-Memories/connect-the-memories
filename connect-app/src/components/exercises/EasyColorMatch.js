import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./EasyColorMatch.css";
import { logExerciseAttempt } from "../../api/database";

const COLORS = ["red", "blue", "green", "yellow"];      
const TOTAL_TIME = 45;                                  

export default function EasyColorMatch() {
  const navigate = useNavigate();

  const [ready,      setReady]      = useState(false);
  const [countdown,  setCountdown]  = useState(null);
  const [timeLeft,   setTimeLeft]   = useState(TOTAL_TIME);

  const [leftColor,  setLeftColor]  = useState("");
  const [rightWord,  setRightWord]  = useState("");
  const [message,    setMessage]    = useState("");

  const [score,      setScore]      = useState(0);
  const [guessCnt,   setGuessCnt]   = useState(0);

  const respondedRef          = useRef(false);
  const guessStartTimeRef     = useRef(null);

  const [correctCnt, setCorrectCnt]   = useState(0);
  const [sumRT,      setSumRT]        = useState(0);  
  const newTrial = () => {
    respondedRef.current = false;
    setMessage("");

    const left  = COLORS[Math.floor(Math.random() * COLORS.length)];
    const match = Math.random() < 0.5;                       

    const right = match
      ? left
      : COLORS.filter(c => c !== left)[
          Math.floor(Math.random() * (COLORS.length - 1))
        ];

    setLeftColor(left);
    setRightWord(right);
    guessStartTimeRef.current = Date.now();
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
    setCountdown(null);
    setReady(true);
  }, [countdown]);

  useEffect(() => {
    if (!ready) return;
    const id = setInterval(() => {
      setTimeLeft(t => (t <= 1 ? 0 : t - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [ready]);

  useEffect(() => { if (ready && timeLeft > 0) newTrial(); }, [ready]);
  useEffect(() => { if (timeLeft === 0) respondedRef.current = true; },
            [timeLeft]);

  useEffect(() => {
    const onKey = e => {
      if (!ready || timeLeft === 0) return;
      if (e.key.toLowerCase() === "m") handleAnswer(true);
      if (e.key.toLowerCase() === "n") handleAnswer(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ready, timeLeft, leftColor, rightWord]);

  const handleAnswer = isMatchSaid => {
    if (respondedRef.current || timeLeft === 0) return;
    respondedRef.current = true;

    const rt  = (Date.now() - guessStartTimeRef.current) / 1000; // sec
    const ok  = (leftColor === rightWord) === isMatchSaid;

    if (ok) {
      const bonus = Math.max(0, 1 - rt);
      setScore(s => s + 1 + bonus);
      setMessage(`Correct +${(1 + bonus).toFixed(2)} pts`);
      setCorrectCnt(c => c + 1);
      setSumRT(ms => ms + rt * 1000);
    } else {
      setMessage("Incorrect!");
    }
    
    setGuessCnt(c => c + 1);

    setTimeout(() => { if (timeLeft > 0) newTrial(); }, 500);
  };

  const restart = () => {
    setReady(false); setCountdown(null); setTimeLeft(TOTAL_TIME);
    setScore(0); setGuessCnt(0); setMessage("");
    setCorrectCnt(0);
    setSumRT(0);
  };

  const accuracy = guessCnt > 0 ? (correctCnt / guessCnt) * 100 : 0;
  const avgRT    = correctCnt > 0 ? (sumRT / correctCnt) / 1000 : 0;   // sec

  // send results to database function

  /* useEffect(() => {
    if (timeLeft === 0 && correctCnt > 0) {
      const sendResults = async () => {
        try {
          await logExerciseAttempt({
            exercise: "EasyColorMatch",
            timestamp: new Date().toISOString(),
            accuracy,
            avg_reaction_time: avgRT
          });
        } catch (err) {
          console.error("Error sending EasyColorMatch results:", err);
        }
      };
  
      sendResults();
    }
  }, [timeLeft]); */
  
  return (
    <div className="easy-memory-container">
      <nav className="nav-bar">
        <a href="/primaryhomepage"><div className="title">CogniSphere</div></a>
        <button className="logout-button" onClick={() => navigate("/optionsformatching")}>← Back</button>
      </nav>

      {/* countdown */}
      {countdown !== null && (
        <div className="countdown-screen"><h1>{countdown}</h1></div>
      )}

      {/* instructions */}
      {!ready && countdown === null && (
        <div className="instructions-screen">
          <h2>Instructions</h2>
          <p>You have 45 s to decide if the <strong>left color card</strong> matches the <strong>right color word</strong>.</p>
          <ul>
            <li><strong>Left:</strong> a solid‑color card.</li>
            <li><strong>Right:</strong> a color word in black text.</li>
          </ul>
          <p>Click <em>Match</em> (or press “M”) if they’re the same color, otherwise <em>No Match</em> (“N”). Answer quickly for bonus points!</p>
          <button className="start-button" onClick={() => setCountdown(3)}>I’m Ready!</button>
        </div>
      )}

      {/* game */}
      {ready && countdown === null && timeLeft > 0 && (
        <div className="easy-color-match">
          <h2 className="timer-text">Time Left: {timeLeft}s</h2>
          <h3>Score: {score.toFixed(2)}</h3>

          <div className="stimuli">
            {/* colored card */}
            <div className="color-card" style={{ background: leftColor }} />
            {/* word */}
            <div className="right-stimulus">{rightWord}</div>
          </div>

          <div className="response-buttons">
            <button className="no-match-button" onClick={() => handleAnswer(false)}>No Match</button>
            <button className="match-button"    onClick={() => handleAnswer(true)}>Match</button>
          </div>

          <p className="message">{message}</p>
        </div>
      )}

      {/* game‑over */}
      {ready && timeLeft === 0 && (
  <div className="game-over-screen">
    <h2 className="timer-text">Time’s Up!</h2>
    <h3>Final Score: {score.toFixed(2)}</h3>
    <h3>You made {guessCnt} guesses in 45 seconds.</h3>
    <h3>Accuracy: {accuracy.toFixed(1)}%</h3>
    <h3>Average Reaction Time: {avgRT.toFixed(2)} s</h3>
    <button className="restart-button" onClick={restart}>Play Again</button>
  </div>
)}
    </div>
  );
}
