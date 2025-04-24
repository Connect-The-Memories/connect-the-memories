import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DarkModeToggle from "../DarkModeToggle";
import "./SpeedProcessing.css";
import { logExerciseAttempt } from "../../api/database";

function SpeedProcessing() {
  const navigate = useNavigate();
  const [numbers, setNumbers] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [reactionTime, setReactionTime] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(100); // exercise timer
  const [gameOver, setGameOver] = useState(false);
  const [countdown, setCountdown] = useState(null); // starting countdown
  const [ready, setReady] = useState(false);
  const [clickedNumbers, setClickedNumbers] = useState({});
  const [guessCount, setGuessCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [sumReactionTime, setSumReactionTime] = useState(0);

  const sampleNums = [2, 4, 5, 1, 3]; // numbers to use for sample
  const correctNumber = 5; // define the correct number for sample

  const handleSampleClick = (num) => {
    setClickedNumbers((prev) => ({
      ...prev,
      [num]: num === correctNumber ? "correct" : "wrong",
    }));
  };

  useEffect(() => {
    console.log("Countdown:", countdown);
    if (countdown === null) return;

    if (countdown > 0) {
      // Exercise start countdown
      const timer1 = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer1);

    } else {
      // Exercise Timer
      setStartTime(Date.now());
      const timer = setInterval(() => {
        console.log("time left:", timeLeft);
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
    }

  }, [countdown]);

  function generateNumbers() {
    if (!gameOver) {
      const newNumbers = new Set();

      while (newNumbers.size < 5) {
        newNumbers.add(Math.floor(Math.random() * 100));
      }

      setNumbers([...newNumbers]); // convert set to array
      setClickedNumbers({})
    }
  }

  function handleClick(number) {
    if (gameOver) return;
  
    const maxNumber = Math.max(...numbers);
    const endTime = Date.now();
    const reaction = endTime - startTime;
  
    setGuessCount(prev => prev + 1);
  
    const isCorrect = number === maxNumber;
    setClickedNumbers((prev) => ({
      ...prev,
      [number]: isCorrect ? "correct" : "wrong",
    }));
  
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
      setSumReactionTime(prev => prev + reaction);
      setReactionTime(reaction);
      setScore(prev => prev + 1);
      generateNumbers();
      setStartTime(Date.now());
    }
  }

  function startExercise() {
    generateNumbers()
    setTimeLeft(30);
    setCountdown(3);
    setReady(true);
  }

  const accuracy = guessCount > 0 ? (correctCount / guessCount) * 100 : 0;
  const avgReactionTime = correctCount > 0 ? (sumReactionTime / correctCount) / 1000 : 0;

  /* useEffect(() => {
    const sendExerciseResults = async () => {
      try {
        await logExerciseAttempt({
          exercise: "NumberSprint",
          timestamp: new Date().toISOString(),
          accuracy,
          avg_reaction_time: avgReactionTime
        });
      } catch (err) {
        console.error("Error sending NumberSprint results:", err);
      }
    };

    if (gameOver && correctCount > 0) {
      sendExerciseResults();
    }
  }, [gameOver]); */ 

  return (
    <div className="exercise-container">
      <nav className="nav-bar">
        <a href="/primaryhomepage"><div className="title">CogniSphere</div></a>
        <div className="navbar-separator"></div>
        <DarkModeToggle />
        <button className="logout-button" onClick={() => navigate("/exerciseselection")}>← Back</button>
      </nav>

      {countdown !== null && countdown !== 0 ? (
        <div className="countdown-screen">
          <h1>{countdown}</h1>
        </div>
      ) : (
        <div className="inner-box">
          {!ready ? (
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
              <p className="game-over-score">Accuracy: {accuracy.toFixed(1)}%</p>
              <p className="game-over-score">Avg Reaction Time: {avgReactionTime.toFixed(2)}s</p>
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
      )}

    </div>
  );
}

export default SpeedProcessing;
