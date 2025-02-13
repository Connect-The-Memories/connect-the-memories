import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MemoryGame.css";

const wordPairs = [
  { thai: "สวัสดี", english: "Hello" },
  { thai: "ขอบคุณ", english: "Thank you" },
  { thai: "ใช่", english: "Yes" },
  { thai: "ไม่ใช่", english: "No" },
  { thai: "หนังสือ", english: "Book" },
  { thai: "แมว", english: "Cat" }
];

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

function MemoryGame() {
  const navigate = useNavigate();
  const [showLearningPhase, setShowLearningPhase] = useState(true);
  const [cards, setCards] = useState([]);
  const [selected, setSelected] = useState([]);
  const [matched, setMatched] = useState([]);

  useEffect(() => {
    // Prepare shuffled cards for matching phase
    const shuffledCards = shuffleArray([
      ...wordPairs.map((word) => ({ text: word.thai, match: word.english, type: "thai" })),
      ...wordPairs.map((word) => ({ text: word.english, match: word.thai, type: "english" }))
    ]);
    setCards(shuffledCards);
  }, []);

  const handleStartGame = () => {
    setShowLearningPhase(false);
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

      {showLearningPhase ? (
        <div className="learning-phase">
          <h2>Memorize these words!</h2>
          <div className="learning-grid">
            {wordPairs.map((pair, index) => (
              <div key={index} className="learning-item">
                <p className="thai-word">{pair.thai}</p>
                <p className="english-word">{pair.english}</p>
              </div>
            ))}
          </div>
          <button className="start-button" onClick={handleStartGame}>
            I'm Ready!
          </button>
        </div>
      ) : (
        <div className="grid">
          {cards.map((card, index) => (
            <button
              key={index}
              className={`card ${selected.includes(index) || matched.includes(index) ? "selected" : ""}`}
              onClick={() => handleSelect(index)}
            >
              {card.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default MemoryGame;
