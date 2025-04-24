import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Journal.css";
import DarkModeToggle from "./DarkModeToggle";
import { useNavigate } from "react-router-dom";

function Journal() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const changeDate = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + direction);
    setSelectedDate(newDate);
  };

  return (
    <div className="journal-page">
      {/* Top Bar */}
      <nav className="nav-bar">
        <a href="/primaryhomepage"><div className="title">CogniSphere</div></a>
        <div className="navbar-separator"></div>
        <DarkModeToggle />
        <button className="logout-button" onClick={() => navigate("/primaryhomepage")}>
          ← Back
        </button>
      </nav>

      <div className="journal-container">
        {/* Journal Entry Section */}
        <div className="journal-entry">
          <h2 className="journal-title">Journal</h2>
          <div className="entry-section">
            <div className="date-navigation">
              <button onClick={() => changeDate(-1)} className="nav-button">&lt;</button>
              <span className="date-text">{selectedDate.toDateString()}</span>
              <button onClick={() => changeDate(1)} className="nav-button">&gt;</button>
            </div>
            <p className="empty-entry">No entry for this day.</p>
          </div>
        </div>

        <div className="calendar-section">
          <Calendar onChange={setSelectedDate} value={selectedDate} className="journal-calendar" />
          <div className="journal-media">Media Placeholder</div>
        </div>
      </div>
    </div>
  );
}

export default Journal;
