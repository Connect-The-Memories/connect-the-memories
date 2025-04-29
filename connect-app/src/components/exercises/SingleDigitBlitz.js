import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DarkModeToggle from "../DarkModeToggle";
import "./SingleDigitBlitz.css";
import { logExerciseAttempt } from "../../api/database"; 

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
  const [ready,      setReady]      = useState(false);
  const [countdown,  setCountdown]  = useState(null);       
  const [timeLeft,   setTimeLeft]   = useState(ROUND_SECONDS);
  const [problem,    setProblem]    = useState(generateProblem());
  const [input,      setInput]      = useState("");
  const [correct,    setCorrect]    = useState(0);
  const [total,      setTotal]      = useState(0);
  const [finished,   setFinished]   = useState(false);
  const [sumRT, setSumRT] = useState(0);


  const timerRef = useRef(null);
  const problemStartRef = useRef(null);

  const primeRound = () => {                              
    setCountdown(3);          
    setFinished(false);
    setReady(false);        
  };

  const actuallyStart = () => {                          
    setReady(true);
    setTimeLeft(ROUND_SECONDS);
    const next = generateProblem();
    problemStartRef.current = Date.now();
    setProblem(next);
    setInput("");
    setCorrect(0);
    setTotal(0);
    setFinished(false);
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const id = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(id);
    }
    setCountdown(null);
    actuallyStart();
  }, [countdown]);

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
    const reactionTime = Date.now() - problemStartRef.current;
  
    if (isCorrect) {
      setCorrect(c => c + 1);
      setSumRT(prev => prev + reactionTime); 
    }
  
    setTotal(t => t + 1);
    setInput("");
  
    const next = generateProblem();
    problemStartRef.current = Date.now();
    setProblem(next);
  };  

  const accuracy = total > 0 ? (correct / total) * 100 : 0;
  const avgRT = correct > 0 ? (sumRT / correct) / 1000 : 0;

  // send results to backend
  useEffect(() => {
    const sendExerciseResults = async () => {
      try {
        await logExerciseAttempt({
          exercise: "SingleDigitBlitz",
          timestamp: new Date().toISOString(),
          accuracy,
          avg_reaction_time: avgRT
        });
      } catch (err) {
        console.error("Error sending SingleDigitBlitz results:", err);
      }
    };

    if (finished && correct > 0) {
      sendExerciseResults();
    }
  }, [finished]); 

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
          <p>Accuracy: {accuracy.toFixed(1)}%</p>
          <p>Average reaction time: {avgRT.toFixed(2)} seconds</p> 
          <button className="start-button" onClick={primeRound}>Play Again</button>
        </div>
      )}
    </div>
  );
}
