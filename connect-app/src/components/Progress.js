import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import './Progress.css';
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
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine
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



  // Mock data to use locally (array of 14 days)
  // const attempts = [
  //   {
  //     date: "2025-04-10",
  //     avg_accuracy: 0.23,
  //     avg_reaction_time: 0.7349693311852756
  //   },
  //   {
  //     date: "2025-04-11",
  //     avg_accuracy: 0.6,
  //     avg_reaction_time: 0.3590438763409098
  //   },
  //   {
  //     date: "2025-04-12",
  //     avg_accuracy: 1,
  //     avg_reaction_time: 0.2305938453098948
  //   },
  //   {
  //     date: "2025-04-13",
  //     avg_accuracy: 0.23,
  //     avg_reaction_time: 0.7349693311852756
  //   },
  //   {
  //     date: "2025-04-14",
  //     avg_accuracy: 0.6,
  //     avg_reaction_time: 0.3590438763409098
  //   },
  //   {
  //     date: "2025-04-15",
  //     avg_accuracy: 1,
  //     avg_reaction_time: 0.2305938453098948
  //   },
  //   {
  //     date: "2025-04-16",
  //     avg_accuracy: 0.23,
  //     avg_reaction_time: 0.7349693311852756
  //   },
  //   {
  //     date: "2025-04-17",
  //     avg_accuracy: 0.6,
  //     avg_reaction_time: 0.3590438763409098
  //   },
  //   {
  //     date: "2025-04-18",
  //     avg_accuracy: 1,
  //     avg_reaction_time: 0.2305938453098948
  //   },
  //   {
  //     date: "2025-04-19",
  //     avg_accuracy: 0.23,
  //     avg_reaction_time: 0.7349693311852756
  //   },
  //   {
  //     date: "2025-04-20",
  //     avg_accuracy: 0.6,
  //     avg_reaction_time: 0.3590438763409098
  //   },
  //   {
  //     date: "2025-04-21",
  //     avg_accuracy: 1,
  //     avg_reaction_time: 0.2305938453098948
  //   },
  //   {
  //     date: "2025-04-22",
  //     avg_accuracy: 0.6,
  //     avg_reaction_time: 0.3590438763409098
  //   },
  //   {
  //     date: "2025-04-23",
  //     avg_accuracy: 1,
  //     avg_reaction_time: 0.2305938453098948
  //   }
  // ];

  const chartData = attempts.map(a => {
    const dateObj = new Date(a.date);
    const formattedDate = `${dateObj.getUTCMonth() + 1}/${dateObj.getUTCDate()}`;
    return {
      date: formattedDate,
      accuracy: a.avg_accuracy,
      reactionTime: a.avg_reaction_time * 1000, // convert to ms
    }
  });

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

      <div className="inner-box">
        <div className="chart">
          <p>Accuracy</p>
          <ResponsiveContainer width="100%" height="80%">
            <AreaChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(value) => `${value.toFixed(0)}%`} domain={[0, 100]} />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "Accuracy (%)") {
                    return [`${value.toFixed(2)}%`, name];
                  }
                  return [value, name];
                }}
              />
              <Legend />
              <Area type="monotone" dataKey="accuracy" name="Accuracy (%)" stroke="#8884d8" fill="#8884d8" activeDot={{ r: 8 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart">
          <p>Average Reaction Time</p>
          <ResponsiveContainer width="100%" height="80%" >
            <AreaChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value, name) => {
                if (name === "Reaction Time (ms)") {
                  return [`${Math.round(value)} ms`, name];
                }
                return [value, name];
              }}
              />
              <Legend />
              <Area type="monotone" dataKey="reactionTime" name="Reaction Time (ms)" stroke="#82ca9d" fill="#82ca9d" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
