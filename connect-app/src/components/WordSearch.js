import React, { useState, useEffect } from 'react';
import './WordSearch.css';
import boatride from "../assets/boatride.jpg"; 

// Single puzzle data
const puzzles = [
  {
    id: 1,
    src: boatride,
    caption: `When I was eight, I set sail on a magical cruise in Mexico, Puerto Vallarta that sparked my imagination.
              The sun shimmered on the endless blue ocean, filling each moment with adventure.
              I remember laughing with new friends as we explored every corner of the ship.
              That unforgettable journey remains a cherished memory of carefree wonder and discovery.`
  }
];

/** 
 * Select up to 5 words from the caption.
 * Filter out short words and punctuation. 
 */
function selectTargetWords(caption) {
  let words = caption
    .split(/\s+/)
    .map((word) => word.replace(/[^\w]/g, '').toLowerCase())
    .filter(Boolean);

  const uniqueWords = Array.from(new Set(words.filter((w) => w.length > 3)));
  return uniqueWords.slice(0, 5); // up to 5 words
}

/** 
 * Generate a word search grid of size gridSize x gridSize,
 * placing words in any of 8 directions (horizontal, vertical, diagonal).
 */
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
    { rowStep: -1, colStep: -1 }  // diagonal up-left
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

  // Attempt to place each target word in one of the 8 directions
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

  // Fill remaining empty cells with random letters
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

/**
 * Return all cells in a line (horizontal, vertical, diagonal) 
 * between startCell and endCell. If they're not aligned in a valid line,
 * returns an empty array.
 */
function getLineOfCells(startCell, endCell) {
  const rowDiff = endCell.row - startCell.row;
  const colDiff = endCell.col - startCell.col;
  const rowStep = Math.sign(rowDiff);
  const colStep = Math.sign(colDiff);
  const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));

  // Only valid if horizontal, vertical, or diagonal
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
  // We'll just use the first puzzle for now
  const [currentPuzzle] = useState(puzzles[0]);

  // Puzzle states
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

  // Start countdown when user clicks "I'm Ready!"
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

  // Once ready, build the puzzle
  useEffect(() => {
    if (ready) {
      // Extract words from the caption
      const words = selectTargetWords(currentPuzzle.caption);
      setTargetWords(words);

      // We'll use a fixed grid size of 12 for a bigger puzzle
      const gridSize = 12;
      const newGrid = generateWordSearchGrid(words, gridSize);
      setGrid(newGrid);

      setFoundWordData([]);
      setTimeTaken(0);
      setTimer(Date.now());
      setShowReveal(false);
    }
  }, [ready, currentPuzzle.caption]);

  // Update highlighted cells in real-time as user drags
  useEffect(() => {
    if (!startCell || !endCell || !selecting) {
      setSelectedCells([]);
      return;
    }
    const lineCells = getLineOfCells(startCell, endCell);
    setSelectedCells(lineCells);
  }, [startCell, endCell, selecting]);

  // Check if all words are found
  const allFound = targetWords.length > 0 && foundWordData.length >= targetWords.length;

  // If all words are found, record total time
  useEffect(() => {
    if (allFound && timer) {
      setTimeTaken(Math.floor((Date.now() - timer) / 1000));
    }
  }, [allFound, timer]);

  // Finalize selection on mouse up or leaving the grid
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

    // Build the string from selected cells
    let letters = lineCells.map(({ row, col }) => grid[row][col]).join('');
    const forward = letters.toLowerCase();
    const backward = [...forward].reverse().join('');

    // Check if it matches a target word
    const foundTarget = targetWords.find(
      (w) => w === forward || w === backward
    );

    // If found and not already in foundWordData, store it
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

  // Check if a cell is part of a found word
  const isCellFound = (r, c) => {
    return foundWordData.some((fw) =>
      fw.cells.some(cell => cell.row === r && cell.col === c)
    );
  };

  return (
    <div className="exercise-container">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="title">CogniSphere</div>
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
      ) : 
      /* 2) Countdown Screen */
      (!ready && countdown !== null) ? (
        <div className="countdown-screen">
          <h1>{countdown}</h1>
        </div>
      ) : 
      /* 3) Show the reveal (photo+caption) if user found all words and clicked "Reveal" */
      (allFound && showReveal) ? (
        <div className="reveal-phase">
          <h3>Here's your memory!</h3>
          <img src={currentPuzzle.src} alt="Revealed" className="reveal-image" />
          <p className="caption">{currentPuzzle.caption}</p>
        </div>
      ) : 
      /* 4) Main Puzzle UI */
      (
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
