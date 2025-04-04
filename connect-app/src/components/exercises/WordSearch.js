import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './WordSearch.css';
import { getRandomizedMedia } from "../../api/database";

/** 
 * Helper function: Select up to 5 words from the caption.
 * Filter out short words (<4 letters) and punctuation. 
 */
/**
 * Select up to 5 words from the given caption:
 * 1. Convert words to lowercase but keep an original reference for checks.
 * 2. Remove punctuation and common stopwords like 'this', 'that', 'with', etc.
 * 3. Prioritize words that appear capitalized in the original text (e.g., "Mexico").
 * 4. If the "interesting" list is too short, allow fallback words from the larger filtered set.
 * 5. Return up to 5 unique words.
 */
function selectTargetWords(caption) {
  // Common English stopwords to exclude.
  // Feel free to expand or adjust this list for your audience.
  const STOPWORDS = new Set([
    'the','and','for','are','but','not','you','all','any','can','had',
    'her','was','one','our','out','day','get','has','him','his','how','man','new',
    'now','old','see','two','way','who','boy','did','its','let','put','say','she',
    'too','use','that','this','from','they','with','like','what','were','been','then',
    'when','where','would','could','there','their','some','your','just','over','into',
    'very','once','such','here','have','more','than','much','those','after','also',
    'because','which','while','about','could','have','into','other','these','thing'
  ]);

  // Split on whitespace, preserving the original word (for capitalization checks)
  const rawWords = caption.split(/\s+/);

  // Step 1 & 2: Convert to lowercase, strip punctuation, filter by length & stopwords
  let filteredWords = [];
  rawWords.forEach((originalWord) => {
    // Remove all punctuation except letters and numbers
    const cleaned = originalWord.replace(/[^\p{L}\p{N}]+/gu, '').toLowerCase(); 
    if (cleaned.length >= 3 && !STOPWORDS.has(cleaned)) {
      filteredWords.push({
        lower: cleaned,
        original: originalWord  // keep the original to detect capitalization
      });
    }
  });

  // Remove duplicates by using a Set keyed by `lower`
  const uniqueMap = new Map();
  filteredWords.forEach((obj) => {
    if (!uniqueMap.has(obj.lower)) {
      uniqueMap.set(obj.lower, obj);
    }
  });
  const uniqueWordsArray = Array.from(uniqueMap.values());

  // Step 3: Prioritize words capitalized in the original text
  // (Heuristic: if the first letter is uppercase in the original text, it might be a place or name)
  const capitalized = [];
  const nonCapitalized = [];
  for (const w of uniqueWordsArray) {
    const firstChar = w.original.charAt(0);
    // Check if it's capitalized (and not all caps from random stylings, etc.)
    if (firstChar === firstChar.toUpperCase() && firstChar !== firstChar.toLowerCase()) {
      capitalized.push(w.lower);
    } else {
      nonCapitalized.push(w.lower);
    }
  }

  // The "interesting" words are capitalized words first, then non-capitalized
  let interestingWords = [...capitalized, ...nonCapitalized];

  // Step 4: If we have fewer than 5 interesting words, we just use them all
  // If we have more than 5, we slice
  interestingWords = interestingWords.slice(0, 5);

  // Step 5: If still no words, we fallback to the original unique set to ensure puzzle is playable
  if (interestingWords.length === 0 && uniqueWordsArray.length > 0) {
    interestingWords = uniqueWordsArray.map((obj) => obj.lower).slice(0, 5);
  }

  return interestingWords;
}

function generateWordSearchGrid(targetWords, gridSize) {
  let grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));

  const directions = [
    { rowStep: 0, colStep: 1 },   // left-to-right
    { rowStep: 0, colStep: -1 },  // right-to-left
    { rowStep: 1, colStep: 0 },   // top-to-bottom
    { rowStep: -1, colStep: 0 },  // bottom-to-top
    { rowStep: 1, colStep: 1 },   // diagonal down-right
    { rowStep: 1, colStep: -1 },  // diagonal down-left
    { rowStep: -1, colStep: 1 },  // diagonal up-right
    { rowStep: -1, colStep: -1 }, // diagonal up-left
  ];

  function canPlaceWord(word, startRow, startCol, dir) {
    for (let i = 0; i < word.length; i++) {
      const r = startRow + i * dir.rowStep;
      const c = startCol + i * dir.colStep;
      if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) return false;
      if (grid[r][c] !== '') return false;
    }
    return true;
  }

  function placeWord(word, startRow, startCol, dir) {
    for (let i = 0; i < word.length; i++) {
      const r = startRow + i * dir.rowStep;
      const c = startCol + i * dir.colStep;
      grid[r][c] = word[i].toUpperCase();
    }
  }

  targetWords.forEach((word) => {
    let placed = false;
    for (let attempt = 0; attempt < 300 && !placed; attempt++) {
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const startRow = Math.floor(Math.random() * gridSize);
      const startCol = Math.floor(Math.random() * gridSize);

      if (canPlaceWord(word, startRow, startCol, dir)) {
        placeWord(word, startRow, startCol, dir);
        placed = true;
      }
    }
    if (!placed) {
      console.log("Could not place word:", word);
    }
  });

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }
  }

  return grid;
}

function getLineOfCells(startCell, endCell) {
  const rowDiff = endCell.row - startCell.row;
  const colDiff = endCell.col - startCell.col;
  const rowStep = Math.sign(rowDiff);
  const colStep = Math.sign(colDiff);
  const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));

  if (!(rowDiff === 0 || colDiff === 0 || Math.abs(rowDiff) === Math.abs(colDiff))) {
    return [];
  }

  let cells = [];
  let curRow = startCell.row;
  let curCol = startCell.col;
  for (let i = 0; i <= steps; i++) {
    cells.push({ row: curRow, col: curCol });
    curRow += rowStep;
    curCol += colStep;
  }
  return cells;
}

const WordSearch = () => {
  const navigate = useNavigate();

  // ------------------------------
  //  1) Puzzle Data (Fetched)
  // ------------------------------
  const [puzzleData, setPuzzleData] = useState(null);

  // ------------------------------
  //  2) Game / Puzzle States
  // ------------------------------
  const [targetWords, setTargetWords] = useState([]);
  const [grid, setGrid] = useState([]);
  const [foundWordData, setFoundWordData] = useState([]); // array of { word, cells: [...] }

  // Timer
  const [timeTaken, setTimeTaken] = useState(0);
  const [timer, setTimer] = useState(null);

  // Pre-instructions & countdown
  const [ready, setReady] = useState(false);
  const [countdown, setCountdown] = useState(null);

  // Selection logic
  const [selecting, setSelecting] = useState(false);
  const [startCell, setStartCell] = useState(null);
  const [endCell, setEndCell] = useState(null);
  const [selectedCells, setSelectedCells] = useState([]);

  // Reveal flow
  const [showReveal, setShowReveal] = useState(false);

  // ------------------------------
  //  3) Countdown to "Ready"
  // ------------------------------
  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const timerId = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      // countdown finished
      setCountdown(null);
      setReady(true);
      setTimer(Date.now());
    }
  }, [countdown]);

  // ------------------------------
  //  4) Fetch Media Once Ready
  // ------------------------------
  useEffect(() => {
    if (ready) {
      fetchPuzzleMedia();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const fetchPuzzleMedia = async () => {
    try {
      const res = await getRandomizedMedia(1);
      if (res.status === 200 && res.data.media && res.data.media.length > 0) {
        const item = res.data.media[0];
        setPuzzleData({
          id: item.media_id || 'media-0',
          src: item.signed_url,
          caption: item.description || 'No caption provided.'
        });
      } else {
        console.error("No media returned. Using fallback puzzle data.");
        // Fallback: Just set a blank or dummy puzzle
        setPuzzleData({
          id: 'fallback-0',
          src: '',
          caption: 'Fallback puzzle caption.'
        });
      }
    } catch (err) {
      console.error("Error fetching puzzle data:", err);
      // Fallback if error occurs
      setPuzzleData({
        id: 'fallback-0',
        src: '',
        caption: 'Fallback puzzle caption.'
      });
    }
  };

  useEffect(() => {
    if (puzzleData) {
      const words = selectTargetWords(puzzleData.caption);
      setTargetWords(words);

      const gridSize = 12;
      const newGrid = generateWordSearchGrid(words, gridSize);
      setGrid(newGrid);

      setFoundWordData([]);
      setTimeTaken(0);
      setTimer(Date.now());
      setShowReveal(false);
    }
  }, [puzzleData]);

  useEffect(() => {
    if (!startCell || !endCell || !selecting) {
      setSelectedCells([]);
      return;
    }
    const lineCells = getLineOfCells(startCell, endCell);
    setSelectedCells(lineCells);
  }, [startCell, endCell, selecting]);

  const allFound = targetWords.length > 0 && foundWordData.length >= targetWords.length;

  useEffect(() => {
    if (allFound && timer) {
      setTimeTaken(Math.floor((Date.now() - timer) / 1000));
    }
  }, [allFound, timer]);

  const finalizeSelection = () => {
    if (!startCell || !endCell) {
      setSelecting(false);
      setSelectedCells([]);
      return;
    }

    const lineCells = getLineOfCells(startCell, endCell);
    if (lineCells.length === 0) {
      setSelecting(false);
      setSelectedCells([]);
      setStartCell(null);
      setEndCell(null);
      return;
    }

    let letters = lineCells.map(({ row, col }) => grid[row][col]).join('');
    const forward = letters.toLowerCase();
    const backward = [...forward].reverse().join('');

    const foundTarget = targetWords.find(
      (w) => w === forward || w === backward
    );

    const alreadyFound = foundWordData.some((fw) => fw.word === foundTarget);
    if (foundTarget && !alreadyFound) {
      setFoundWordData((prev) => [
        ...prev,
        { word: foundTarget, cells: lineCells }
      ]);
    }

    setSelecting(false);
    setSelectedCells([]);
    setStartCell(null);
    setEndCell(null);
  };

  const isCellFound = (r, c) => {
    return foundWordData.some((fw) =>
      fw.cells.some(cell => cell.row === r && cell.col === c)
    );
  };

  return (
    <div className="exercise-container">
      {/* Top Bar */}
      <div className="nav-bar">
        <div className="title">CogniSphere</div>
        <button className="logout-button" onClick={() => navigate("/exerciseselection")}>
          ← Back
        </button>
      </div>

      {/* 1) Pre-Instructions Screen */}
      {!ready && countdown === null ? (
        <div className="instructions-screen">
          <h2>Instructions</h2>
          <p>
            In this fun activity, you'll search for words hidden in a grid.
            They can appear horizontally, vertically, or diagonally.
          </p>
          <p>
            <strong>How to Play:</strong>
            <br />
            Press and hold your mouse button on the first letter of the word.
            While holding down, drag your mouse to the last letter of the word,
            then release.
            If it's correct, the word will be marked as found!
          </p>
          <p>
            Once you've found all the words, you'll see a "Congratulations!" screen.
            Press "Reveal" to see the memory photo and caption.
          </p>
          <button className="start-button" onClick={() => setCountdown(3)}>
            I'm Ready!
          </button>
        </div>
      ) : !ready && countdown !== null ? (
        /* 2) Countdown Screen */
        <div className="countdown-screen">
          <h1>{countdown}</h1>
        </div>
      ) : (allFound && showReveal) ? (
        /* 3) Show the reveal (photo + caption) if user found all words and clicked "Reveal" */
        <div className="reveal-phase">
          <h3>Here's your memory!</h3>
          {puzzleData?.src && (
            <img src={puzzleData.src} alt="Revealed" className="reveal-image" />
          )}
          <p className="caption">{puzzleData?.caption}</p>
        </div>
      ) : (
        /* 4) Main Puzzle UI */
        <div className="game-ui">
          <div className="target-words">
            <h3>Find These Words:</h3>
            <ul>
              {targetWords.map((word, idx) => {
                const foundIt = foundWordData.some((fw) => fw.word === word);
                return (
                  <li key={idx} className={foundIt ? 'found' : ''}>
                    {word.toUpperCase()}
                  </li>
                );
              })}
            </ul>
          </div>

          <div
            className="grid-container"
            onMouseUp={finalizeSelection}
            onMouseLeave={() => {
              if (selecting) finalizeSelection();
            }}
          >
            {grid.map((row, rowIndex) => (
              <div key={rowIndex} className="grid-row">
                {row.map((letter, colIndex) => {
                  // Is this cell in the current drag selection?
                  const isHighlighted = selectedCells.some(
                    (cell) => cell.row === rowIndex && cell.col === colIndex
                  );
                  // Is this cell part of a found word?
                  const isPersistFound = isCellFound(rowIndex, colIndex);

                  let cellClass = 'grid-cell';
                  if (isHighlighted) cellClass += ' highlighted';
                  if (isPersistFound) cellClass += ' foundWordCell';

                  return (
                    <span
                      key={colIndex}
                      className={cellClass}
                      onMouseDown={() => {
                        setSelecting(true);
                        setStartCell({ row: rowIndex, col: colIndex });
                        setEndCell({ row: rowIndex, col: colIndex });
                      }}
                      onMouseEnter={() => {
                        if (selecting) {
                          setEndCell({ row: rowIndex, col: colIndex });
                        }
                      }}
                    >
                      {letter}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="timer-display">
            {!allFound ? (
              <p>Time elapsed: {Math.floor((Date.now() - timer) / 1000)} seconds</p>
            ) : (
              // The user found all words, but hasn't revealed the memory yet
              <div className="finished-phase">
                <h3>Congratulations! You've found all the words!</h3>
                <p>Your time: {timeTaken} seconds</p>
                <button className="reveal-button" onClick={() => setShowReveal(true)}>
                  Reveal
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WordSearch;
