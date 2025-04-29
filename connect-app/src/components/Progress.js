import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import { getExerciseAttempts } from '../api/database';
import { useAuth } from '../context/AuthContext';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function Progress() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    if (!token) {
      setError("You are not logged in.");
      setTimeout(() => navigate("/"), 100);
      return;
    }

    async function fetchData() {
      try {
        const res = await getExerciseAttempts();
        console.log('✅ Attempts response:', res);
        const raw = res.data.exercise_data || [];
        const data = raw.map(item => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
        data.sort((a, b) => b.timestamp - a.timestamp);
        setAttempts(data);
      } catch (err) {
        console.error('Error fetching attempts:', err.response || err);
        setError('Failed to load progress data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [token]);

  if (loading) return <p>Loading progress...</p>;
  if (error) return <p>{error}</p>;

  const chartData = attempts.map(a => ({
    date: a.timestamp.toLocaleDateString(),
    accuracy: a.accuracy,
    time: a.avg_reaction_time
  }));

  return (
    <div className="hp-container">
      <nav className="nav-bar">
        <a href="/primaryhomepage"><div className="title">CogniSphere</div></a>
        <div className="navbar-separator"></div>
        <DarkModeToggle />
        <button className="logout-button" onClick={() => navigate("/primaryhomepage")}>
          ← Back
        </button>
      </nav>
    </div>
  );
}
