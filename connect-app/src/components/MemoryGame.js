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
  const [guesses, setGuesses] = useState([]); 
  const [matched, setMatched] = useState([]); 
  const [timer, setTimer] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [checked, setChecked] = useState(false); 

  useEffect(() => {
    if (!gameStarted) return;

    if (checked) return;

    if (timer === 0) {
      setGameOver(true);
      return;
    }

    const countdown = setInterval(() => {
      setTimer((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer, gameStarted, checked]);

  const handleDifficultySelect = (level) => {
    setDifficulty(level);
    setShowLearningPhase(true);

    let selectedWordsData;
    if (level === "easy") {
      selectedWordsData = getRandomWords(easyMediumWords, 3);
    } else if (level === "medium") {
      selectedWordsData = getRandomWords(easyMediumWords, 6);
    } else {
      selectedWordsData = getRandomWords(hardWords, 6);
    }

    setSelectedWords(selectedWordsData);

    const shuffledCards = shuffleArray([
      ...selectedWordsData.map((word) => ({
        text: word.thai,
        match: word.english,
        type: "thai",
      })),
      ...selectedWordsData.map((word) => ({
        text: word.english,
        match: word.thai,
        type: "english",
      })),
    ]);
    setCards(shuffledCards);
  };

  const handleStartGame = () => {
    let initialTime = 30; 
    if (difficulty === "medium") {
      initialTime = 45;
    } else if (difficulty === "hard") {
      initialTime = 60;
    }
    setTimer(initialTime);
    
    setGameOver(false);
    setShowLearningPhase(false);
    setGameStarted(true);
    setSelected([]);
    setGuesses([]);
    setMatched([]);
    setChecked(false);
  };

  const handleSelect = (index) => {
    if (selected.length === 2 || checked) return;
    if (selected.includes(index)) return;
    
    const newSelected = [...selected, index];
    setSelected(newSelected);
  
    if (newSelected.length === 2) {
      const firstCard = cards[newSelected[0]];
      const secondCard = cards[newSelected[1]];
      
      if (firstCard.type === secondCard.type) {
        alert("Please connect a Thai word with its English translation.");
        setTimeout(() => {
          setSelected([]);
        }, 500);
        return; 
      }
  
      setGuesses((prevGuesses) => [...prevGuesses, newSelected]);
      setTimeout(() => {
        setSelected([]);
      }, 800);
    }
  };
  

  const handleCheckAnswers = () => {
    let newMatched = [];
    guesses.forEach((guess) => {
      if (guess.length !== 2) return;
      const firstCard = cards[guess[0]];
      const secondCard = cards[guess[1]];
      if (
        firstCard.match === secondCard.text &&
        secondCard.match === firstCard.text
      ) {
        newMatched.push(...guess);
      }
    });
    setMatched(newMatched);
    setChecked(true);
  };

  const guessedIndices = guesses.flat();

  return (
    <div className="memory-container">
      <nav className="top-bar">
        <div className="title">CogniSphere</div>
        <button
          className="back-button"
          onClick={() => navigate("/exerciseselection")}
        >
          ← Back
        </button>
      </nav>

      <h1 className="game-title">Match the Thai Words with English Meaning</h1>

      {!difficulty ? (
        <div className="difficulty-selection">
          <h3>Select Difficulty</h3>
          <button
            className="difficulty-button easy"
            onClick={() => handleDifficultySelect("easy")}
          >
            Easy
          </button>
          <button
            className="difficulty-button medium"
            onClick={() => handleDifficultySelect("medium")}
          >
            Medium
          </button>
          <button
            className="difficulty-button hard"
            onClick={() => handleDifficultySelect("hard")}
          >
            Hard
          </button>
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
          <button className="start-button" onClick={handleStartGame}>
            I'm Ready!
          </button>
        </div>
      ) : (
        <div>
          <h3 className="timer-text">Time Left: {timer}s</h3>
          <div className="grid">
            {cards.map((card, index) => {
              let cardClass = "card";
              if (checked) {
                // After checking, highlight correct guesses in green and incorrect ones in red.
                if (matched.includes(index)) {
                  cardClass += " matched";
                } else if (guessedIndices.includes(index)) {
                  cardClass += " incorrect";
                }
              } else {
                // Before checking, all guessed cards get a special highlight.
                if (guessedIndices.includes(index)) {
                  cardClass += " guessed";
                }
                if (selected.includes(index)) {
                  cardClass += " selected";
                }
              }
              return (
                <button
                  key={index}
                  className={cardClass}
                  onClick={() => handleSelect(index)}
                  // Disable a card if it has already been guessed.
                  disabled={gameOver || guessedIndices.includes(index)}
                >
                  {card.text}
                </button>
              );
            })}
          </div>
          <div>
            {!checked && (
              <button
                className="check-answers-button"
                onClick={handleCheckAnswers}
                // Only enable "Check Answers" if at least one guess has been made.
                disabled={guesses.length === 0}
              >
                Check Answers
              </button>
            )}
            {checked && (
              <p>
                You got{" "}
                {
                  guesses.filter((guess) => {
                    if (guess.length !== 2) return false;
                    const firstCard = cards[guess[0]];
                    const secondCard = cards[guess[1]];
                    return (
                      firstCard.match === secondCard.text &&
                      secondCard.match === firstCard.text
                    );
                  }).length
                }{" "}
                out of {(cards.length / 2)} correct!
              </p>
            )}
          </div>
          {gameOver && <h3 className="game-over">Time's up!</h3>}
        </div>
      )}
    </div>
  );
}

export default MemoryGame;
