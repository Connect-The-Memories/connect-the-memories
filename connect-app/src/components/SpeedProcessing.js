import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SpeedProcessing.css";

function SpeedProcessing() {
  const navigate = useNavigate();
  const [numbers, setNumbers] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [reactionTime, setReactionTime] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30); // 30-second countdown
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    generateNumbers();

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
      const newNumbers = Array.from({ length: 5 }, () => Math.floor(Math.random() * 100));
      setNumbers(newNumbers);
      setStartTime(Date.now());
    }
  }

  function handleClick(number) {
    if (gameOver) return; // Stop game if time is up

    const maxNumber = Math.max(...numbers);
    if (number === maxNumber) {
      const endTime = Date.now();
      setReactionTime(endTime - startTime);
      setScore(score + 1);
      generateNumbers();
    }
  }

  return (
    <div className="exercise-container">
      <nav className="top-bar">
        <div className="title">Speed of Processing</div>
        <button className="back-button" onClick={() => navigate("/exerciseselection")}>← Back</button>
      </nav>

      {gameOver ? (
        <div className="game-over">
          <h2>Game Over!</h2>
          <p>Final Score: {score}</p>
          <button className="restart-button" onClick={() => window.location.reload()}>Play Again</button>
        </div>
      ) : (
        <>
          <p>Time Left: {timeLeft}s</p>
          <p>Click the **largest** number as fast as you can!</p>
          <div className="number-container">
            {numbers.map((num, index) => (
              <button key={index} className="number-button" onClick={() => handleClick(num)}>
                {num}
              </button>
            ))}
          </div>
          {reactionTime && <p>Reaction Time: {reactionTime}ms</p>}
          <p>Score: {score}</p>
        </>
      )}
    </div>
  );
}

export default SpeedProcessing;
