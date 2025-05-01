import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Journal.css";
import DarkModeToggle from "./DarkModeToggle";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getJournalEntries } from "../api/database";

export default function Journal() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [entries, setEntries] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalImageUrl, setModalImageUrl] = useState(null);

  const changeDate = (dir) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + dir);
    setSelectedDate(d);
  };

  useEffect(() => {
    if (!token) {
      navigate("/", { replace: true });
      return;
    }
    setLoading(true);
    setError(null);

    const dayStart = new Date(selectedDate);
    dayStart.setHours(0, 0, 0, 0);
    const iso = dayStart.toISOString();

    getJournalEntries(iso)
      .then((res) => {
        const list = res.data.entries || [];
        setEntries(list);
        setActiveIdx(0);
      })
      .catch((err) => {
        console.error("Journal fetch error:", err);
        setError("Failed to load journal entries.");
      })
      .finally(() => setLoading(false));
  }, [selectedDate, token, navigate]);

  const openModal = (url) => setModalImageUrl(url);
  const closeModal = () => setModalImageUrl(null);

  const changeEntry = (dir) => {
    setActiveIdx((idx) => {
      const next = idx + dir;
      if (next < 0 || next >= entries.length) return idx;
      return next;
    });
  };

  const activeEntry = entries[activeIdx] || {};

  return (
    <div className="journal-page hp-container">
      <nav className="nav-bar">
        <a href="/primaryhomepage"><div className="title">CogniSphere</div></a>
        <div className="navbar-separator" />
        <DarkModeToggle />
        <button className="logout-button" onClick={() => navigate("/primaryhomepage")}>← Back</button>
      </nav>

      <div className="journal-container">
        {/* Entries Section */}
        <div className="journal-entry">
          <h2 className="journal-title">Journal</h2>
          <div className="entry-section">
            <div className="date-navigation">
              <button onClick={() => changeDate(-1)} className="nav-button">‹</button>
              <span className="date-text">{selectedDate.toDateString()}</span>
              <button onClick={() => changeDate(1)} className="nav-button">›</button>
            </div>

            {loading ? (
              <p className="loading-text">Loading entries…</p>
            ) : error ? (
              <p className="error-text">{error}</p>
            ) : entries.length === 0 ? (
              <p className="empty-entry">No entry for this day.</p>
            ) : (
              <>
                <div className="photo-navigation">
                  <button onClick={() => changeEntry(-1)} className="nav-button" disabled={activeIdx === 0}>Prev Entry</button>
                  <span className="date-text">Entry {activeIdx + 1} of {entries.length}</span>
                  <button onClick={() => changeEntry(1)} className="nav-button" disabled={activeIdx === entries.length - 1}>Next Entry</button>
                </div>
                <div className="journal-card">
                  <div className="entry-header">
                    <span>{new Date(activeEntry.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="entry-text">{activeEntry.entry}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Calendar & Media Preview */}
        <div className="calendar-section">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            className="journal-calendar"
          />
          <div className="journal-media">
            {activeEntry.signed_url ? (
              <img
                src={activeEntry.signed_url}
                alt="Journal media"
                className="media-preview clickable"
                onClick={() => openModal(activeEntry.signed_url)}
              />
            ) : (
              <p>No memories here 😢</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal for full-screen image */}
      {modalImageUrl && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={modalImageUrl} alt="Enlarged" className="enlarged-photo" />
            <button className="close-button" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
