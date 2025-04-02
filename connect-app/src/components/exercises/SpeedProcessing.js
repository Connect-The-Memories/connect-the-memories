import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SpeedProcessing.css";

function SpeedProcessing() {
  const navigate = useNavigate();
  const [numbers, setNumbers] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [reactionTime, setReactionTime] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(100); // countdown
  const [gameOver, setGameOver] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [clickedNumbers, setClickedNumbers] = useState({});

  const sampleNums = [2, 4, 5, 1, 3]; // numbers to use for sample
  const correctNumber = 5; // define the correct number for sample

  const handleSampleClick = (num) => {
    setClickedNumbers((prev) => ({
      ...prev,
      [num]: num === correctNumber ? "correct" : "wrong",
    }));
  };

  useEffect(() => {
    // Countdown Timer
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setGameOver(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  function generateNumbers() {
    if (!gameOver) {
      const newNumbers = new Set();

      while (newNumbers.size < 5) {
        newNumbers.add(Math.floor(Math.random() * 100));
      }

      setNumbers([...newNumbers]); // convert set to array
      setClickedNumbers({})
      setStartTime(Date.now());
    }
  }

  function handleClick(number) {
    if (gameOver) return; // Stop game if time is up

    const maxNumber = Math.max(...numbers);

    setClickedNumbers((prev) => ({
      ...prev,
      [number]: number === maxNumber ? "correct" : "wrong",
    }));

    if (number === maxNumber) {
      const endTime = Date.now();
      setReactionTime(endTime - startTime);
      setScore(score + 1);
      generateNumbers();
    }
  }

  function startExercise() {
    generateNumbers()
    setTimeLeft(30);
    setShowInstructions(false);
  }

  return (
    <div className="exercise-container">
      <nav className="nav-bar">
        <div className="title">CogniSphere</div>
        <button className="logout-button" onClick={() => navigate("/exerciseselection")}>← Back</button>
      </nav>

      <div className="inner-box">
        {showInstructions ? (
          <div className="instructions-container">
            <h1 className="instructions-title">Instructions</h1>
            <p className="instructions-text">
              You will be shown 5 numbers, keep selecting the largest number
              in each series as quick as possible until the time runs out!
            </p>
            <p className="exercise-text">Try it out:</p>
            <div className="number-container">
              {sampleNums.map((num, index) => (
                <div key={index} className="button-wrapper">
                  <button
                    key={index}
                    className={`number-button ${clickedNumbers[num]}`}
                    onClick={() => handleSampleClick(num)}
                  >
                    {num}
                  </button>
                  {clickedNumbers[num] === "correct" ? (
                    <span className="correct-check">✓</span>
                  ) : clickedNumbers[num] === "wrong" ? (
                    <span className="wrong-x">✖</span>
                  ) : (
                    <span className="unclicked">.</span>
                  )}
                </div>
              ))}
            </div>
            <button className="start-exercise-button" onClick={() => startExercise()}>Start!</button>
          </div>
        ) : (gameOver ? (
          <div className="game-over">
            <h2 className="game-over-title">Game Over!</h2>
            <p className="game-over-score">Final Score: {score}</p>
            <button className="restart-button" onClick={() => window.location.reload()}>Play Again</button>
          </div>
        ) : (
          <>
            <p className="exercise-text">Time Left: {timeLeft}s</p>
            <p className="exercise-text">Click the largest number as fast as you can!</p>
            <div className="number-container">
              {numbers.map((num, index) => (
                <div key={index} className="button-wrapper">
                  <button
                    key={index}
                    className={`number-button ${clickedNumbers[num]}`}
                    onClick={() => handleClick(num)}
                  >
                    {num}
                  </button>
                  {clickedNumbers[num] === "correct" ? (
                    <span className="correct-check">✓</span>
                  ) : clickedNumbers[num] === "wrong" ? (
                    <span className="wrong-x">✖</span>
                  ) : (
                    <span className="unclicked">.</span>
                  )}
                </div>
              ))}
            </div>
            {reactionTime && <p>Reaction Time: {reactionTime}ms</p>}
            <p className="exercise-text">Score: {score}</p>
          </>
        )
        )}
      </div>

    </div>
  );
}

export default SpeedProcessing;
