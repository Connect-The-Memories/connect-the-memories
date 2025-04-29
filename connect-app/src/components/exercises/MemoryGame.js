import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DarkModeToggle from "../DarkModeToggle";
import "./MemoryGame.css";
import { easyMediumWords, hardWords } from "../../thaiWords";

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

const PALETTE = [
  "#FFD700", // gold
  "#87CEFA", // light sky blue
  "#DA70D6", // orchid
  "#FFA07A", // light salmon
  "#20B2AA", // light sea green
  "#9370DB", // medium purple
  "#FFB6C1", // light pink
];

function getRandomWords(wordsArray, count) {
  const shuffled = shuffleArray(wordsArray);
  return shuffled.slice(0, count);
}

function MemoryGame() {
  const [currentRound, setCurrentRound] = useState(1);
  const totalRounds = 3;

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
  const [guessColors, setGuessColors] = useState({}); 

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
    setGuessColors({});
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
      const color = PALETTE[guesses.length % PALETTE.length];

      setGuessColors((prev) => ({
        ...prev,
        [newSelected[0]]: color,
        [newSelected[1]]: color,
      }));

      setGuesses((prev) => [...prev, newSelected]);
      setTimeout(() => {
        setSelected([]);
      }, 800);
    }
  };


  const handleCheckAnswers = () => {
    let newGuessColors = {};
  
    guesses.forEach(([i, j]) => {
      const a = cards[i], b = cards[j];
      const correct = a.match === b.text && b.match === a.text;
      const color = correct ? "#4CAF50" : "#e74c3c"; // green or red
      newGuessColors[i] = color;
      newGuessColors[j] = color;
    });
  
    setGuessColors(newGuessColors);
    setChecked(true);
    setGameOver(false);
    setMatched(
      Object.entries(newGuessColors)
        .filter(([_, c]) => c === "#4CAF50")
        .flatMap(([idx]) => [+idx])
    );
  };
  
  const handleNextRound = () => {
    if (currentRound < totalRounds) {
      setCurrentRound((prevRound) => prevRound + 1);
      setChecked(false);
      setSelected([]);
      setGuesses([]);
      setMatched([]);
      setGameOver(false);
      setShowLearningPhase(true);
      setGuessColors({});

      let selectedWordsData =
        difficulty === "easy"
          ? getRandomWords(easyMediumWords, 3)
          : getRandomWords(hardWords, 6);

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

      let initialTime = 30;
      if (difficulty === "medium") initialTime = 45;
      if (difficulty === "hard") initialTime = 60;

      setTimer(initialTime);
    }
  };


  const guessedIndices = guesses.flat();

  return (
    <div className="memory-container">
      <nav className="nav-bar">
        <a href="/primaryhomepage"><div className="title">CogniSphere</div></a>
        <div className="navbar-separator"></div>
        <DarkModeToggle />
        <button
          className="logout-button"
          onClick={() => navigate("/exerciseselection")}
        >
          ← Back
        </button>
      </nav>

      <div className="inner-box">
        <h1 className="game-title">Match the Thai Words with English Meaning</h1>

        {!difficulty ? (
          <div className="difficulty-selection">
            <h3 className="game-title">Select Difficulty</h3>
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
            <h3 className="instructions-text">Memorize these words!</h3>
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
            <p className="round-text">Round {currentRound} of {totalRounds}</p>
            {gameOver ? <p className="game-over">Time's up!</p>
              : <p className="timer-text">Time Left: {timer}s</p>}

            <div className="grid">
            {cards.map((card, idx) => {
              const isSelected = selected.includes(idx);
              const isGuessed  = guesses.flat().includes(idx);
              const isChecked  = checked;

              let classes = ["card"];
              let style   = {};

              if (!isChecked) {
                if (isSelected) classes.push("selected");
            
                if (guessColors[idx]) {
                  style.backgroundColor = guessColors[idx];
                  style.color           = "#000";
                } else if (isGuessed) {
                  classes.push("guessed");
                }
              } else {
                if (guessColors[idx]) {
                  style.backgroundColor = guessColors[idx];
                  style.color           = "#fff";
                }
              }

              return (
                <button
                  key={idx}
                  className={classes.join(" ")}
                  style={style}
                  onClick={() => handleSelect(idx)}
                  disabled={gameOver || isGuessed}
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
                  disabled={guesses.length === 0}
                >
                  Check Answers
                </button>
              )}
              {checked && (
                <div className="results-container">
                  <h2 className="results-text">
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
                </h2>
                </div>
              )}
              {checked && currentRound < totalRounds && (
                <button
                  className="check-answers-button"
                  onClick={() => handleNextRound()}
                >
                  Next Round
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MemoryGame;
