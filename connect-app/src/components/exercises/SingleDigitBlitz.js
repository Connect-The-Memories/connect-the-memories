import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DarkModeToggle from "../DarkModeToggle";
import "./SingleDigitBlitz.css";

const ROUND_SECONDS = 60;
const OPS = ["+", "-", "×"];

function generateProblem() {
  const op = OPS[Math.floor(Math.random() * OPS.length)];
  let a = 1 + Math.floor(Math.random() * 9);
  let b = 1 + Math.floor(Math.random() * 9);
  if (op === "-" && a < b) [a, b] = [b, a];
  const answer = op === "×" ? a * b : op === "+" ? a + b : a - b;
  return { a, b, op, answer };
}

export default function SingleDigitBlitz() {
  const navigate = useNavigate();

  /* ───────── state ───────── */
  const [ready,      setReady]      = useState(false);
  const [countdown,  setCountdown]  = useState(null);       // ← NEW
  const [timeLeft,   setTimeLeft]   = useState(ROUND_SECONDS);
  const [problem,    setProblem]    = useState(generateProblem());
  const [input,      setInput]      = useState("");
  const [correct,    setCorrect]    = useState(0);
  const [total,      setTotal]      = useState(0);
  const [finished,   setFinished]   = useState(false);

  const timerRef = useRef(null);

  /* ───────── helpers ───────── */
  const primeRound = () => {                                 // ← renamed
    setCountdown(3);          // trigger overlay countdown   // ← NEW
    setFinished(false);
    setReady(false);          // will flip to true after c/d  // ← NEW
  };

  const actuallyStart = () => {                              // ← NEW
    setReady(true);
    setTimeLeft(ROUND_SECONDS);
    setProblem(generateProblem());
    setInput("");
    setCorrect(0);
    setTotal(0);
    setFinished(false);
  };

  /* ───────── countdown overlay ───────── */                // ← NEW
  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const id = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(id);
    }
    // reached zero → start the round
    setCountdown(null);
    actuallyStart();
  }, [countdown]);

  /* ───────── round timer ───────── */
  useEffect(() => {
    if (!ready || finished) return;
    clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [ready, finished]);

  const handleSubmit = () => {
    if (input.trim() === "") return;
    const isCorrect = parseInt(input, 10) === problem.answer;
    if (isCorrect) setCorrect(c => c + 1);
    setTotal(t => t + 1);
    setInput("");
    setProblem(generateProblem());
  };

  /* ─────────  UI  ───────── */
  if (countdown !== null) {
    return (
      <div className="exercise-container">
        <nav className="nav-bar">
          <a href="/primaryhomepage"><div className="title">CogniSphere</div></a>
        </nav>
        <div className="countdown-screen">
          <h1>{countdown}</h1>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="exercise-container">
        <nav className="nav-bar">
          <a href="/primaryhomepage"><div className="title">CogniSphere</div></a>
          <div className="navbar-separator"></div>
          <DarkModeToggle />
          <button className="logout-button" onClick={() => navigate("/exerciseselection")}>
            ← Back
          </button>
        </nav>

        <div className="instructions-screen">
          <h2>Instructions</h2>
          <p>Solve as many single‑digit (+, −, ×) problems as you can in 60 seconds.</p>
          <p>Type the answer and press <strong>Enter</strong> or click <em>Submit</em>.</p>
          <button className="start-button" onClick={primeRound}>Start</button>
        </div>
      </div>
    );
  }

  /* ───────── game / results ───────── */
  return (
    <div className="exercise-container">
      <div className="nav-bar">
        <div className="title">CogniSphere</div>
        <div className="navbar-separator"></div>
        <DarkModeToggle />
        <button className="logout-button" onClick={() => navigate("/exerciseselection")}>
          ← Back
        </button>
      </div>

      {!finished ? (
        <div className="game-area">
          <h2 className="status-text">Time Left: {timeLeft}s</h2>

          <div className="problem-display">
            {problem.a} {problem.op} {problem.b} =
          </div>

          <div className="answer-area">
            <input
              className="answer-input"
              type="number"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              autoFocus
            />
            <button className="start-button" onClick={handleSubmit}>Submit</button>
          </div>

          <p className="status-text">Correct: {correct} / {total}</p>
        </div>
      ) : (
        <div className="instructions-screen">
          <h2>Round Complete!</h2>
          <p>You answered {total} problems.</p>
          <p>Correct answers: {correct}</p>
          <p>Accuracy: {total ? ((correct / total) * 100).toFixed(1) : 0}%</p>
          <button className="start-button" onClick={primeRound}>Play Again</button>
        </div>
      )}
    </div>
  );
}
