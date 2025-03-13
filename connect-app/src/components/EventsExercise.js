import React, { useState, useEffect } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import "./EventsExercise.css";
import { useNavigate } from "react-router-dom"; 

import babyleah from '../assets/babyleah.jpg';
import boatride from '../assets/boatride.jpg';
import familychurch from '../assets/familychurch.jpg'; 

// DraggableImage component using @dnd-kit's useDraggable
const DraggableImage = ({ id, image }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="draggable-image">
      <img src={image.src} alt={image.title} className="image" />
    </div>
  );
};

// DroppableContainer component with a faded label and optional result border color
const DroppableContainer = ({ id, children, label, result }) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  
  // If results exist, override border color; otherwise, use default
  let borderStyle;
  if (result === "correct") {
    borderStyle = "2px solid green";
  } else if (result === "incorrect") {
    borderStyle = "2px solid red";
  } else {
    // Use dashed border that changes when hovered over (isOver)
    borderStyle = "2px dashed " + (isOver ? "blue" : "gray");
  }
  
  const style = {
    border: borderStyle,
    width: "300px",
    height: "200px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative", // For the faded label overlay
  };

  return (
    <div ref={setNodeRef} style={style} className="droppable-container">
      <span className="zone-label">{label}</span>
      {children}
    </div>
  );
};

function EventsExercise() {
  const navigate = useNavigate();
    
  // Our initial array of images with metadata
  const initialPalette = [
    { id: "1", title: "Image 1", src: babyleah, metadata: { date: "2021-01-01" } },
    { id: "2", title: "Image 2", src: boatride, metadata: { date: "2013-01-01" } },
    { id: "3", title: "Image 3", src: familychurch, metadata: { date: "2019-01-01" } },
  ];

  // Compute the correct order by sorting by date (ascending)
  const correctOrder = [...initialPalette]
    .sort((a, b) => new Date(a.metadata.date) - new Date(b.metadata.date))
    .map(item => item.id);  // e.g., if sorted by date: ["2", "3", "1"]

  const [palette, setPalette] = useState(initialPalette);
  const [dropZones, setDropZones] = useState({
    "drop-0": null,
    "drop-1": null,
    "drop-2": null,
  });
  const [activeFrom, setActiveFrom] = useState(null);
  
  // Start the timer when the component mounts
  const [startTime, setStartTime] = useState(null);
  useEffect(() => {
    setStartTime(Date.now());
  }, []);
  
  // State to store results (accuracy and time)
  const [results, setResults] = useState(null);
  
  const handleDragStart = (event) => {
    const { active } = event;
    if (palette.find((item) => item.id === active.id)) {
      setActiveFrom("palette");
    } else {
      const zoneKey = Object.keys(dropZones).find(
        (zone) => dropZones[zone] && dropZones[zone].id === active.id
      );
      setActiveFrom(zoneKey || null);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) {
      setActiveFrom(null);
      return;
    }
    const destination = over.id;

    if (destination === activeFrom) {
      setActiveFrom(null);
      return;
    }

    // Moving into a Drop Zone
    if (destination.startsWith("drop")) {
      if (dropZones[destination] !== null) {
        setActiveFrom(null);
        return;
      }
      if (activeFrom === "palette") {
        const item = palette.find((item) => item.id === active.id);
        if (item) {
          setPalette((prev) => prev.filter((i) => i.id !== active.id));
          setDropZones((prev) => ({ ...prev, [destination]: item }));
        }
      }
    }

    // Moving back to the Palette
    if (destination === "palette" && activeFrom !== "palette") {
      const item = dropZones[activeFrom];
      if (item) {
        setDropZones((prev) => ({ ...prev, [activeFrom]: null }));
        setPalette((prev) => [...prev, item]);
      }
    }
    setActiveFrom(null);
  };

  // Reset the board while keeping the original startTime (timer continues)
  const handleResetBoard = () => {
    setPalette(initialPalette);
    setDropZones({
      "drop-0": null,
      "drop-1": null,
      "drop-2": null,
    });
    setResults(null);
    // startTime remains unchanged
  };

  // Redo the entire exercise (after checking answers) with a fresh timer
  const handleRedo = () => {
    setPalette(initialPalette);
    setDropZones({
      "drop-0": null,
      "drop-1": null,
      "drop-2": null,
    });
    setResults(null);
    setStartTime(Date.now());
  };

  // Check Answers: calculate accuracy and time taken, then show results in the UI.
  const handleCheckAnswers = () => {
    const zoneKeys = ["drop-0", "drop-1", "drop-2"];
    // Ensure all drop zones are filled
    if (zoneKeys.some(zone => !dropZones[zone])) {
      alert("Please fill all drop zones before checking your answers.");
      return;
    }
    
    // Calculate time taken in seconds
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    
    // Calculate correct count based on correctOrder (by date)
    let correctCount = 0;
    zoneKeys.forEach((zone, index) => {
      const placedId = dropZones[zone]?.id;
      const expectedId = correctOrder[index];
      if (placedId === expectedId) {
        correctCount++;
      }
    });
    
    setResults({
      correctCount,
      total: zoneKeys.length,
      timeTaken,
    });
  };

  return (
    <div className="hp-container">
      <nav className="top-bar">
        <div className="title">CogniSphere</div>
        <button className="logout-button" onClick={() => navigate("/exerciseselection")}>
          ← Back
        </button>
      </nav>

      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="dropzones-container">
          <h3>Drop Zones</h3>
          <div className="dropzones">
            {["drop-0", "drop-1", "drop-2"].map((zoneId, index) => {
              // Determine result for each zone if results exist
              let result;
              if (results && dropZones[zoneId]) {
                result = (dropZones[zoneId].id === correctOrder[index]) ? "correct" : "incorrect";
              }
              return (
                <DroppableContainer key={zoneId} id={zoneId} label={index + 1} result={result}>
                  {dropZones[zoneId] && (
                    <DraggableImage id={dropZones[zoneId].id} image={dropZones[zoneId]} />
                  )}
                </DroppableContainer>
              );
            })}
          </div>
        </div>

        <div className="palette-container">
          <div id="palette" className="palette">
            {palette.map((item) => (
              <DraggableImage key={item.id} id={item.id} image={item} />
            ))}
          </div>
        </div>
      </DndContext>

      <div className="buttons-container">
        <button className="check-answers-button" onClick={handleCheckAnswers}>
          Check Answers
        </button>
        {results ? (
          <button className="check-answers-button" onClick={handleRedo}>
            Redo
          </button>
        ) : (
          <button className="check-answers-button" onClick={handleResetBoard}>
            Reset
          </button>
        )}
      </div>

      {results && (
        <div className="results">
          <p>You got {results.correctCount} out of {results.total} correct!</p>
          <p>Time taken: {results.timeTaken} seconds</p>
        </div>
      )}
    </div>
  );
}

export default EventsExercise;
