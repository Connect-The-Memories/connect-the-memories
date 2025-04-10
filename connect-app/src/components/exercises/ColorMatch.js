import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ColorMatch.css";

const initialColors = ["red", "blue", "green", "yellow"];
const extraColors = ["purple", "orange"];
const totalTime = 45;

function ColorMatch() {
  const navigate = useNavigate();

  const [ready, setReady] = useState(false);
  const [countdown, setCountdown] = useState(null); 

  const [score, setScore] = useState(0);
  const [guessCount, setGuessCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);        
  const [sumReactionTime, setSumReactionTime] = useState(0);  

  const [leftWord, setLeftWord] = useState("");
  const [leftColor, setLeftColor] = useState("");
  const [rightWord, setRightWord] = useState("");
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [message, setMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);

  const respondedRef = useRef(false);
  const guessStartTimeRef = useRef(null);

  const setupNewStimuli = () => {
    setMessage("");
    respondedRef.current = false;

    let colorPool = [...initialColors];
    if (guessCount >= 5) {
      colorPool = [...initialColors, ...extraColors];
    }

    const randomLeftWord = colorPool[Math.floor(Math.random() * colorPool.length)];
    const randomLeftColor = colorPool[Math.floor(Math.random() * colorPool.length)];

    setLeftWord(randomLeftWord);
    setLeftColor(randomLeftColor);

    const isMatchTrial = Math.random() < 0.4; // 40% chance

    let newRightWord;
    if (isMatchTrial) {
      newRightWord = randomLeftColor;
    } else {
      const nonMatchPool = colorPool.filter((color) => color !== randomLeftColor);
      newRightWord = nonMatchPool[Math.floor(Math.random() * nonMatchPool.length)];
    }

    setRightWord(newRightWord);
    guessStartTimeRef.current = Date.now();
  };

  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCountdown(null);
      setReady(true); // start the game when countdown reaches 0
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  }, [ready, gameOver, leftColor, rightWord]);

  const handleUserResponse = (isUserSayingMatch) => {
    if (gameOver || respondedRef.current) return;
    respondedRef.current = true;

    const reactionTime = Date.now() - guessStartTimeRef.current; // in ms
    const isMatch = leftColor === rightWord;

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
      
      setCorrectCount((prev) => prev + 1);            // INCREMENT CORRECT GUESS
      setSumReactionTime((prev) => prev + reactionTime);  // ADD REACTION TIME
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
    setCorrectCount(0);      // RESET CORRECT COUNT
    setSumReactionTime(0);   // RESET SUM REACTION TIME
    setTimeLeft(totalTime);
    setGameOver(false);
    setCountdown(null);
    setReady(false);
  };

  // calculate accuracy and average reaction time
  // if you want average reaction time for *all* guesses, you'd use sumReactionTime / guessCount
  // if you only want it for correct guesses (common in reaction tasks), do sumReactionTime / correctCount
  const accuracy = guessCount > 0 ? (correctCount / guessCount) * 100 : 0;
  const avgReactionTime =
    correctCount > 0 ? (sumReactionTime / correctCount) / 1000 : 0; // in seconds

  return (
    <div className="memory-container">
      <nav className="nav-bar">
        <div className="title">CogniSphere</div>
        <button
          className="logout-button"
          onClick={() => navigate("/optionsformatching")}
        >
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
            Welcome to Color Match! You have 45 seconds total to see how many matches you can get.
            Each time, you'll see:
          </p>
          <ul>
            <li>
              <strong>Left:</strong> A color word displayed in a random color (e.g., "BLUE" in red text).
            </li>
            <li>
              <strong>Right:</strong> A color word in neutral text (e.g., "red").
            </li>
          </ul>
          <p>
            If the <strong>color</strong> of the left word matches the <strong>word</strong> on the right, click “Match.”
            Otherwise, click “No Match.” Answer quickly for a reaction-time bonus!
          </p>
          <p>
            You can use your keyboard (press "M" for Match and "N" for No Match)
            or click the buttons with your mouse/pad.
          </p>
          <button className="start-button" onClick={() => setCountdown(3)}>
            I'm Ready!
          </button>
        </div>
      ) : (
        <div className="advanced-color-match">
          {!gameOver ? (
            <div>
              <h2 className="timer-text">Time Left: {timeLeft}s</h2>
              <h3>Score: {score.toFixed(2)}</h3>

              <div className="stimuli">
                <div className="left-stimulus" style={{ color: leftColor }}>
                  {leftWord}
                </div>
                <div className="right-stimulus">{rightWord}</div>
              </div>

              <div className="response-buttons">
                <button
                  className="no-match-button"
                  onClick={() => handleUserResponse(false)}
                >
                  No Match
                </button>
                <button
                  className="match-button"
                  onClick={() => handleUserResponse(true)}
                >
                  Match
                </button>
              </div>

              <p className="message">{message}</p>
            </div>
          ) : (
            <div className="game-over-screen">
              <h2 className="timer-text">Time's Up!</h2>
              <h3>Your Final Score: {score.toFixed(2)}</h3>
              <h3>You made {guessCount} guesses in 45 seconds.</h3>

              <h3>Accuracy: {accuracy.toFixed(1)}%</h3>
              <h3>Average Reaction Time: {avgReactionTime.toFixed(2)}s</h3>

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

export default ColorMatch;

