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

  const chartData = attempts.map(a => ({
    date: a.timestamp.toLocaleDateString(),
    accuracy: a.accuracy,
    time: a.avg_reaction_time
  }));

  // Mock data to use locally (array of 14 days)
  // const data = [
  //   {
  //     date: "2025-04-27",
  //     normalized_accuracy: 0.23,
  //     normalized_rt: 0.7349693311852756
  //   },
  //   {
  //     date: "2025-04-28",
  //     normalized_accuracy: 0.6,
  //     normalized_rt: 0.3590438763409098
  //   },
  //   {
  //     date: "2025-04-29",
  //     normalized_accuracy: 1,
  //     normalized_rt: 0.2305938453098948
  //   },
  //   {
  //     date: "2025-04-27",
  //     normalized_accuracy: 0.23,
  //     normalized_rt: 0.7349693311852756
  //   },
  //   {
  //     date: "2025-04-28",
  //     normalized_accuracy: 0.6,
  //     normalized_rt: 0.3590438763409098
  //   },
  //   {
  //     date: "2025-04-29",
  //     normalized_accuracy: 1,
  //     normalized_rt: 0.2305938453098948
  //   },
  //   {
  //     date: "2025-04-27",
  //     normalized_accuracy: 0.23,
  //     normalized_rt: 0.7349693311852756
  //   },
  //   {
  //     date: "2025-04-28",
  //     normalized_accuracy: 0.6,
  //     normalized_rt: 0.3590438763409098
  //   },
  //   {
  //     date: "2025-04-29",
  //     normalized_accuracy: 1,
  //     normalized_rt: 0.2305938453098948
  //   },
  //   {
  //     date: "2025-04-27",
  //     normalized_accuracy: 0.23,
  //     normalized_rt: 0.7349693311852756
  //   },
  //   {
  //     date: "2025-04-28",
  //     normalized_accuracy: 0.6,
  //     normalized_rt: 0.3590438763409098
  //   },
  //   {
  //     date: "2025-04-29",
  //     normalized_accuracy: 1,
  //     normalized_rt: 0.2305938453098948
  //   },
  //   {
  //     date: "2025-04-28",
  //     normalized_accuracy: 0.6,
  //     normalized_rt: 0.3590438763409098
  //   },
  //   {
  //     date: "2025-04-29",
  //     normalized_accuracy: 1,
  //     normalized_rt: 0.2305938453098948
  //   }
  // ]

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
        {/* <p>Accuracy</p> */}
        <ResponsiveContainer width="100%" height="50%">
          <AreaChart
            data={attempts}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(dateStr) => {
                const date = new Date(dateStr);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} domain={[0, 1]} />
            <Tooltip
              formatter={(value, name) => [`${(value * 100).toFixed(2)}%`, name]}
            />
            <Legend />
            <Area type="monotone" dataKey="normalized_accuracy" name="Accuracy (%)" stroke="#8884d8" fill="#8884d8" activeDot={{ r: 8 }} />
          </AreaChart>
        </ResponsiveContainer>

        {/* <p>Reaction Time</p> */}
        <ResponsiveContainer width="100%" height="50%">
          <AreaChart
            data={attempts}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(dateStr) => {
                const date = new Date(dateStr);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <YAxis domain={[0, 1]} />
            <Tooltip />
            <Legend />
            <ReferenceLine y={1} label="Max" stroke="red" strokeDasharray="3 3" />
            <Area type="monotone" dataKey="normalized_rt" name="Reaction Time" stroke="#82ca9d" fill="#82ca9d" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
