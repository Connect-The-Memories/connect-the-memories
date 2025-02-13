import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MemoryGame.css";
import { easyMediumWords, hardWords } from "../thaiWords";

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

function getRandomWords(wordsArray, count) {
  const shuffled = shuffleArray(wordsArray);
  return shuffled.slice(0, count);
}

function MemoryGame() {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState(null);
  const [showLearningPhase, setShowLearningPhase] = useState(false);
  const [selectedWords, setSelectedWords] = useState([]); 
  const [cards, setCards] = useState([]);
  const [selected, setSelected] = useState([]);
  const [matched, setMatched] = useState([]);
  const [timer, setTimer] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (!gameStarted) return;

    if (timer === 0) {
      setGameOver(true);
      return;
    }

    const countdown = setInterval(() => {
      setTimer((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer, gameStarted]);

  const handleDifficultySelect = (level) => {
    setDifficulty(level);
    setShowLearningPhase(true);

    let selectedWords;
    if (level === "easy") {
      selectedWords = getRandomWords(easyMediumWords, 3);
    } else if (level === "medium") {
      selectedWords = getRandomWords(easyMediumWords, 6);
    } else {
      selectedWords = getRandomWords(hardWords, 6);
    }

    setSelectedWords(selectedWords); // Store selected words

    const shuffledCards = shuffleArray([
      ...selectedWords.map((word) => ({ text: word.thai, match: word.english, type: "thai" })),
      ...selectedWords.map((word) => ({ text: word.english, match: word.thai, type: "english" }))
    ]);

    setCards(shuffledCards);
  };

  const handleStartGame = () => {
    setTimer(30);
    setGameOver(false);
    setShowLearningPhase(false);
    setGameStarted(true);
  };

  const handleSelect = (index) => {
    if (selected.length === 2 || matched.includes(index)) return;

    const newSelected = [...selected, index];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      const firstCard = cards[newSelected[0]];
      const secondCard = cards[newSelected[1]];

      if (firstCard.match === secondCard.text && secondCard.match === firstCard.text) {
        setMatched([...matched, newSelected[0], newSelected[1]]);
      }

      setTimeout(() => {
        setSelected([]);
      }, 800);
    }
  };

  return (
    <div className="memory-container">
      <nav className="top-bar">
        <div className="title">CogniSphere</div>
        <button className="back-button" onClick={() => navigate("/exerciseselection")}>
          ← Back
        </button>
      </nav>

      <h1 className="game-title">Match the Thai Words with English Meaning</h1>

      {!difficulty ? (
        <div className="difficulty-selection">
          <h3>Select Difficulty</h3>
          <button className="difficulty-button easy" onClick={() => handleDifficultySelect("easy")}>Easy</button>
          <button className="difficulty-button medium" onClick={() => handleDifficultySelect("medium")}>Medium</button>
          <button className="difficulty-button hard" onClick={() => handleDifficultySelect("hard")}>Hard</button>
        </div>
      ) : showLearningPhase ? (
        <div className="learning-phase">
          <h3>Memorize these words!</h3>
          <div className="learning-grid">
            {selectedWords.map((pair, index) => ( 
              <div key={index} className="learning-item">
                <p className="thai-word">{pair.thai}</p>
                <p className="english-word">{pair.english}</p>
              </div>
            ))}
          </div>
          <button className="start-button" onClick={handleStartGame}>I'm Ready!</button>
        </div>
      ) : (
        <div>
          <h3 className="timer-text">Time Left: {timer}s</h3>
          <div className="grid">
            {cards.map((card, index) => (
              <button
                key={index}
                className={`card ${selected.includes(index) || matched.includes(index) ? "selected" : ""}`}
                onClick={() => handleSelect(index)}
                disabled={gameOver}
              >
                {card.text}
              </button>
            ))}
          </div>
          {gameOver && <h3 className="game-over">Time's up! Try again.</h3>}
        </div>
      )}
    </div>
  );
}

export default MemoryGame;
