import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getRandomizedMedia } from "../../api/database";
import RequiredGalleryImages from "../RequiredGalleryImages";
import DarkModeToggle from "../DarkModeToggle";
import "./QuickChronology.css";

const totalTime = 45;

function QuickChronology() {
  const navigate = useNavigate();
  const [media, setMedia] = useState([]);
  const [currentPair, setCurrentPair] = useState([]);
  const [usedPairs, setUsedPairs] = useState([]);

  const [ready, setReady] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");

  const [score, setScore] = useState(0);
  const [guessCount, setGuessCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [sumReactionTime, setSumReactionTime] = useState(0);

  const guessStartTimeRef = useRef(null);
  const respondedRef = useRef(false);

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
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [ready]);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await getRandomizedMedia(10);
        if (res.status === 200 && res.data.media.length >= 2) {
          setMedia(res.data.media);
        }
      } catch (err) {
        console.error("Error fetching media:", err);
      }
    };
    fetchMedia();
  }, []);

  useEffect(() => {
    if (media.length >= 2 && ready && !gameOver) {
      loadNextPair();
    }
  }, [media, ready, gameOver]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!ready || gameOver) return;
      if (e.key === "ArrowLeft") handleGuess(0);
      if (e.key === "ArrowRight") handleGuess(1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [ready, gameOver, currentPair]);

  const loadNextPair = () => {
    if (media.length < 2) return;
    let idx1, idx2;
    do {
      idx1 = Math.floor(Math.random() * media.length);
      idx2 = Math.floor(Math.random() * media.length);
    } while (idx1 === idx2 || usedPairs.includes(`${idx1}-${idx2}`) || usedPairs.includes(`${idx2}-${idx1}`));

    setUsedPairs((prev) => [...prev, `${idx1}-${idx2}`]);
    setCurrentPair([media[idx1], media[idx2]]);
    guessStartTimeRef.current = Date.now();
    respondedRef.current = false;
    setMessage("");
  };

  const handleGuess = (selectedIndex) => {
    if (respondedRef.current || gameOver) return;
    respondedRef.current = true;

    const [first, second] = currentPair;
    const correctIndex = new Date(first.approx_date_taken) < new Date(second.approx_date_taken) ? 0 : 1;
    const isCorrect = selectedIndex === correctIndex;

    const reactionTime = Date.now() - guessStartTimeRef.current;

    if (isCorrect) {
      const reactionTimeSec = reactionTime / 1000;
      const bonus = Math.max(0, 1 - reactionTimeSec);
      setScore((prev) => prev + 1 + bonus);
      setCorrectCount((prev) => prev + 1);
      setSumReactionTime((prev) => prev + reactionTime);
      setMessage(`Correct! +${(1 + bonus).toFixed(2)} points`);
    } else {
      setMessage("Incorrect!");
    }
    setGuessCount((prev) => prev + 1);

    setTimeout(() => {
      if (!gameOver && timeLeft > 0) {
        loadNextPair();
      }
    }, 500);
  };

  const handleRestart = () => {
    setReady(false);
    setCountdown(null);
    setGameOver(false);
    setTimeLeft(totalTime);
    setScore(0);
    setGuessCount(0);
    setCorrectCount(0);
    setSumReactionTime(0);
    setUsedPairs([]);
    loadNextPair();
  };

  const accuracy = guessCount > 0 ? (correctCount / guessCount) * 100 : 0;
  const avgReactionTime = correctCount > 0 ? (sumReactionTime / correctCount) / 1000 : 0;

  return (
    <RequiredGalleryImages min={10}>
      <div className="memory-container">
        <nav className="nav-bar">
          <a href="/primaryhomepage"><div className="title">CogniSphere</div></a>
          <div className="navbar-separator"></div>
          <DarkModeToggle />
          <button className="logout-button" onClick={() => navigate("/exerciseselection")}>
            ← Back
          </button>
        </nav>

        {countdown !== null ? (
          <div className="countdown-screen"><h1>{countdown}</h1></div>
        ) : !ready ? (
            <div className="inner-box">
            <h2 className="instructions-title">Instructions</h2>
            <p className="instructions-subtext">
              In this game, you'll see two photos from your personal gallery displayed side by side.
            </p>
            <p className="instructions-subtext">
              Your task is to look at both photos and pick the one that happened earlier in time. This helps train your memory and sense of time by connecting meaningful life events.
            </p>
            <p className="instructions-subtext">
              You can use the left and right arrow keys on your keyboard, or simply click the buttons below each photo to make your selection.
            </p>
            <p className="instructions-subtext">
              The game lasts for 45 seconds. Try to get as many correct as you can—answering quickly earns you bonus points!
            </p>
            <button className="start-button" onClick={() => setCountdown(3)}>I'm Ready!</button>
          </div>
        ) : !gameOver ? (
          <div className="advanced-color-match">
            <h2 className="timer-text">Time Left: {timeLeft}s</h2>
            <h3>Score: {score.toFixed(2)}</h3>

            <div className="stimuli">
              {currentPair.map((item, i) => (
                <div key={i} className="image-option">
                  <img src={item.signed_url} alt={`Photo ${i}`} className="chrono-image" />
                  <button onClick={() => handleGuess(i)}>
                    {i === 0 ? "Left is Earlier" : "Right is Earlier"}
                  </button>
                </div>
              ))}
            </div>

            <p className="message">{message}</p>
          </div>
        ) : (
          <div className="game-over-screen">
            <h2 className="timer-text">Time's Up!</h2>
            <h3>Your Final Score: {score.toFixed(2)}</h3>
            <h3>Guesses: {guessCount}</h3>
            <h3>Accuracy: {accuracy.toFixed(1)}%</h3>
            <h3>Avg Reaction Time: {avgReactionTime.toFixed(2)}s</h3>
            <button className="restart-button" onClick={handleRestart}>Play Again</button>
          </div>
        )}
      </div>
    </RequiredGalleryImages>
  );
}

export default QuickChronology;
