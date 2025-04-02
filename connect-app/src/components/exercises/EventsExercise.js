import React, { useState, useEffect } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import "./EventsExercise.css";
import { useNavigate } from "react-router-dom";

import babyleah from "../../assets/babyleah.jpg";
import boatride from "../../assets/boatride.jpg";
import familychurch from "../../assets/familychurch.jpg";

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

function shuffleArray(array) {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

const DroppableContainer = ({ id, children, label, result }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  let borderStyle;
  if (result === "correct") {
    borderStyle = "6px solid #00ff00";
  } else if (result === "incorrect") {
    borderStyle = "6px solid red";
  } else {
    borderStyle = "2px dashed " + (isOver ? "blue" : "gray");
  }

  const style = {
    border: borderStyle,
    width: "300px",
    height: "200px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
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
  // initial array
  const initialPalette = [
    { id: "1", title: "Image 1", src: babyleah, metadata: { date: "2021-01-01" } },
    { id: "2", title: "Image 2", src: boatride, metadata: { date: "2013-01-01" } },
    { id: "3", title: "Image 3", src: familychurch, metadata: { date: "2019-01-01" } },
  ];

  const correctOrder = [...initialPalette]
    .sort((a, b) => new Date(a.metadata.date) - new Date(b.metadata.date))
    .map(item => item.id);

  const [palette, setPalette] = useState(() => shuffleArray(initialPalette));
  const [dropZones, setDropZones] = useState({
    "drop-0": null,
    "drop-1": null,
    "drop-2": null,
  });
  const [activeFrom, setActiveFrom] = useState(null);

  const [ready, setReady] = useState(false);
  const [countdown, setCountdown] = useState(null);

  const [startTime, setStartTime] = useState(null);
  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCountdown(null);
      setReady(true);
      setStartTime(Date.now());
    }
  }, [countdown]);

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

    if (destination === "palette" && activeFrom !== "palette") {
      const item = dropZones[activeFrom];
      if (item) {
        setDropZones((prev) => ({ ...prev, [activeFrom]: null }));
        setPalette((prev) => [...prev, item]);
      }
    }
    setActiveFrom(null);
  };

  const handleResetBoard = () => {
    setPalette(shuffleArray(initialPalette));
    setDropZones({
      "drop-0": null,
      "drop-1": null,
      "drop-2": null,
    });
    setResults(null);
  };

  const handleRedo = () => {
    setPalette(shuffleArray(initialPalette));
    setDropZones({
      "drop-0": null,
      "drop-1": null,
      "drop-2": null,
    });
    setResults(null);
    setStartTime(Date.now());
  };

  const handleCheckAnswers = () => {
    const zoneKeys = ["drop-0", "drop-1", "drop-2"];
    if (zoneKeys.some(zone => !dropZones[zone])) {
      alert("Please fill all drop zones before checking your answers.");
      return;
    }

    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

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

      {/* Pre-Instructions and Countdown */}
      {!ready && countdown === null ? (
        <div className="instructions-screen">
          <h2>Instructions</h2>
          <p>
            In this fun and engaging game, you'll be arranging cherished photos in the order of their dates.
          </p>
          <p>
            Simply drag and drop each picture into the drop zone that best fits its chronological order. Enjoy a gentle stroll down memory lane while keeping your mind active!
          </p>
          <p>
            Once you've arranged the photos, press <strong>"Check Answers"</strong> to see if your order is correct.
            If you wish to try again before checking, use the <strong>"Reset"</strong> button to clear your selections.
            There are three rounds per game. Have Fun!
          </p>
          <button className="start-button" onClick={() => setCountdown(3)}>
            I'm Ready!
          </button>
        </div>
      ) : !ready && countdown !== null ? (
        <div className="countdown-screen">
          <h1>{countdown}</h1>
        </div>
      ) : (
        // Main game UI (when ready)
        <>
          <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="dropzones-container">
              <h3>Drop Zones</h3>
              <div className="dropzones">
                {["drop-0", "drop-1", "drop-2"].map((zoneId, index) => {
                  let result;
                  if (results && dropZones[zoneId]) {
                    result = (dropZones[zoneId].id === correctOrder[index])
                      ? "correct"
                      : "incorrect";
                  }
                  return (
                    <div key={zoneId} className="zone-and-date">
                      <DroppableContainer
                        id={zoneId}
                        label={index + 1}
                        result={result}
                      >
                        {dropZones[zoneId] && (
                          <DraggableImage
                            id={dropZones[zoneId].id}
                            image={dropZones[zoneId]}
                          />
                        )}
                      </DroppableContainer>
                      {results && dropZones[zoneId] && (
                        <p className="image-date">{dropZones[zoneId].metadata.date}</p>
                      )}
                    </div>
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
            {!results && (
              <>
                <button className="check-answers-button" onClick={handleCheckAnswers}>
                  Check Answers
                </button>
                <button className="check-answers-button" onClick={handleResetBoard}>
                  Reset
                </button>
              </>
            )}
            {results && (
              <button className="redo-button" onClick={handleRedo}>
                Redo
              </button>
            )}
          </div>

          {results && (
            <div className="results">
              <p>You got {results.correctCount} out of {results.total} correct!</p>
              <p>Time taken: {results.timeTaken} seconds</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default EventsExercise;
