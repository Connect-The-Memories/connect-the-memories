import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ColorMatch.css"; 
import "./Shapes.css";

const initialShapes = ["circle", "square", "triangle", "star"];
const extraShapes = ["diamond", "heart", "pentagon", "hexagon", "oval"];
const totalTime = 45;

function ShapeMatch() {
  const navigate = useNavigate();

  const [ready, setReady] = useState(false);
  const [countdown, setCountdown] = useState(null);

  const [score, setScore] = useState(0);
  const [guessCount, setGuessCount] = useState(0);
  const [leftShape, setLeftShape] = useState("");
  const [displayedShape, setDisplayedShape] = useState("");
  const [rightShapeName, setRightShapeName] = useState("");
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [message, setMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);

  const respondedRef = useRef(false);
  const guessStartTimeRef = useRef(null);

  const setupNewStimuli = () => {
    setMessage("");
    respondedRef.current = false;

    let shapePool = [...initialShapes];
    if (guessCount >= 5) {
      shapePool = [...initialShapes, ...extraShapes];
    }

    const randomLeftShape = shapePool[Math.floor(Math.random() * shapePool.length)];
    setLeftShape(randomLeftShape);

    const shapeMap = {
      circle: <div className="shape circle"></div>,
      square: <div className="shape square"></div>,
      triangle: <div className="shape triangle"></div>,
      star: (
        <svg width="50" height="50" viewBox="0 0 24 24" fill="black">
          <polygon points="12,2 15,10 24,10 17,15 20,23 12,18 4,23 7,15 0,10 9,10"/>
        </svg>
      ),
      diamond: <div className="shape diamond"></div>,
      pentagon: <div className="shape pentagon"></div>,
      hexagon: <div className="shape hexagon"></div>,
      heart: (
        <svg width="50" height="50" viewBox="0 0 24 24" fill="black">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      ),
      oval: (
        <svg width="80" height="50" viewBox="0 0 100 50" fill="black">
          <ellipse cx="50" cy="25" rx="45" ry="22"/>
        </svg>
      ) 
    };
    
    

    setDisplayedShape(shapeMap[randomLeftShape]);

    const isMatchTrial = Math.random() < 0.4; // 40% chance for a match

    let newRightShapeName;
    if (isMatchTrial) {
      newRightShapeName = randomLeftShape;
    } else {
      const nonMatchPool = shapePool.filter((shape) => shape !== randomLeftShape);
      newRightShapeName = nonMatchPool[Math.floor(Math.random() * nonMatchPool.length)];
    }

    setRightShapeName(newRightShapeName);
    guessStartTimeRef.current = Date.now();
  };

  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCountdown(null);
      setReady(true);
    }
  }, [countdown]);

  useEffect(() => {
    if (!ready) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true);
          clearInterval(timerId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [ready]);

  useEffect(() => {
    if (ready && !gameOver) {
      setupNewStimuli();
    }
  }, [ready, gameOver]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!ready || gameOver) return;

      const key = event.key.toLowerCase();
      if (key === "m") {
        handleUserResponse(true);
      } else if (key === "n") {
        handleUserResponse(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [ready, gameOver, leftShape, rightShapeName, guessStartTimeRef.current]);

  const handleUserResponse = (isUserSayingMatch) => {
    if (gameOver || respondedRef.current) return;
    respondedRef.current = true;

    const reactionTime = Date.now() - guessStartTimeRef.current;
    const isMatch = leftShape === rightShapeName;

    let isCorrect = false;
    if (isUserSayingMatch && isMatch) {
      isCorrect = true;
    } else if (!isUserSayingMatch && !isMatch) {
      isCorrect = true;
    }

    if (isCorrect) {
      const reactionTimeInSeconds = reactionTime / 1000;
      const bonus = Math.max(0, 1 - reactionTimeInSeconds);
      setScore((prev) => prev + 1 + bonus);
      setMessage(`Correct! +${(1 + bonus).toFixed(2)} points`);
    } else {
      setMessage("Incorrect!");
    }

    setGuessCount((prev) => prev + 1);

    setTimeout(() => {
      if (!gameOver && timeLeft > 0) {
        setupNewStimuli();
      }
    }, 500);
  };

  const handleRestart = () => {
    setScore(0);
    setGuessCount(0);
    setTimeLeft(totalTime);
    setGameOver(false);
    setCountdown(null);
    setReady(false);
  };

  return (
    <div className="memory-container">
      {/* Navigation Bar */}
      <nav className="top-bar">
        <div className="title">CogniSphere</div>
        <button className="logout-button" onClick={() => navigate("/exerciseselection")}>
          ← Back
        </button>
      </nav>

      {/* If countdown is active, show countdown */}
      {countdown !== null ? (
        <div className="countdown-screen">
          <h1>{countdown}</h1>
        </div>
      ) : !ready ? (
        <div className="instructions-screen">
          <h2>Instructions</h2>
          <p>
            Welcome to Shape Match! You have 45 seconds total to see how many matches you can get.
            Each time, you'll see:
          </p>
          <ul>
            <li><strong>Left:</strong> A shape displayed visually (e.g., ⬛).</li>
            <li><strong>Right:</strong> A shape name in text (e.g., "square").</li>
          </ul>
          <p>
            If the **shape on the left matches the shape name on the right**, click “Match.” Otherwise, click “No Match.” 
            Answer quickly for a reaction-time bonus!
          </p>
          <p>
            You can use your keyboard (press "M" for Match and "N" for No Match) or click the buttons with your mouse/pad.
          </p>
          <button className="start-button" onClick={() => setCountdown(3)}>
            I'm Ready!
          </button>
        </div>
      ) : (
        <div className="advanced-shape-match">
          {!gameOver ? (
            <div>
              <h2 className="timer-text">Time Left: {timeLeft}s</h2>
              <h3>Score: {score.toFixed(2)}</h3>

              {/* Display the two stimuli */}
              <div className="stimuli">
                {/* Left Stimulus: Shape Icon */}
                <div className="left-stimulus">
                  {displayedShape}
                </div>
                {/* Right Stimulus: Shape Name */}
                <div className="right-stimulus">{rightShapeName}</div>
              </div>

              {/* Buttons for user response */}
              <div className="response-buttons">
                <button className="match-button" onClick={() => handleUserResponse(true)}>Match</button>
                <button className="no-match-button" onClick={() => handleUserResponse(false)}>No Match</button>
              </div>

              <p className="message">{message}</p>
            </div>
          ) : (
            <div className="game-over-screen">
              <h2 className="timer-text">Time's Up!</h2>
              <h3>Your Final Score: {score.toFixed(2)}</h3>
              <h3>You made {guessCount} guesses in 45 seconds.</h3>
              <button className="restart-button" onClick={handleRestart}>
                Play Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ShapeMatch;
