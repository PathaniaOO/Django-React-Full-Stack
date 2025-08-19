import { motion, AnimatePresence } from 'framer-motion';
import { TrophyIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';
import api from '../api';
import { ACCESS_TOKEN } from "../constants";

function Home() {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [yourScore, setYourScore] = useState(null);
  const [period, setPeriod] = useState("");

  const isLoggedIn = !!localStorage.getItem(ACCESS_TOKEN);
  const medalColors = ['text-yellow-500', 'text-gray-400', 'text-orange-500'];
  const gameObj = games.find(game => game.id === parseInt(selectedGame));

  // Fetch games on mount
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await api.get('/apiapp/game/');
        setGames(response.data);
      } catch (err) {
        console.error("Error fetching games:", err);
      }
    };
    fetchGames();
  }, []);

  // Fetch leaderboard whenever selectedGame or period changes
  useEffect(() => {
    if (!selectedGame) return;
    const fetchLeaderboard = async () => {
      try {
        const response = await api.get(`/apiapp/leaderboard/${selectedGame}/`, {
          params: { period }
        });
        setLeaderboard(response.data.scores || []);
        setYourScore(response.data.your_score || null);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      }
    };
    fetchLeaderboard();
  }, [selectedGame, period]);

  // Add points to user's score
  const handleAddPoints = async (points) => {
    if (!selectedGame) return;
    try {
      await api.patch("/apiapp/score/update/", {
        increment: points,
        game: selectedGame
      });
      // Refresh leaderboard and yourScore
      const response = await api.get(`/apiapp/leaderboard/${selectedGame}/`, {
        params: { period }
      });
      setLeaderboard(response.data.scores || []);
      setYourScore(response.data.your_score || null);
    } catch (err) {
      console.error(err);
    }
  };

  // Reset user's score
  const handleResetScore = async () => {
    if (!selectedGame) return;
    try {
      await api.delete("/apiapp/score/reset/", {
        data: { game: selectedGame }
      });
      // Refresh leaderboard
      const response = await api.get(`/apiapp/leaderboard/${selectedGame}/`, {
        params: { period }
      });
      setLeaderboard(response.data.scores || []);
      setYourScore(response.data.your_score || null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        {/* Game Selection */}
        <h2 className="text-2xl font-bold mb-4 text-indigo-600">Select a game</h2>
        <select
          value={selectedGame || ''}
          onChange={(e) => setSelectedGame(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">--Select a game--</option>
          {games.map(game => (
            <option key={game.id} value={game.id}>{game.name}</option>
          ))}
        </select>

        {/* Period Filter */}
        {selectedGame && (
          <div className="mb-4 flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Filter:</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Alltime</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        )}

        {/* Selected Game Info */}
        {selectedGame && (
          <AnimatePresence>
            <motion.div
              key={selectedGame}
              className="mb-4 flex items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <img
                src={gameObj?.image || '/default_game.png'}
                alt={gameObj?.name || "Game"}
                className="w-16 h-16 rounded-md object-cover"
              />
              <h2 className="text-lg font-semibold text-gray-800">{gameObj?.name}</h2>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Leaderboard */}
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className='text-xl font-semibold mb-3 text-gray-700'>Leaderboard</h3>
            <ul className='space-y-2'>
              {leaderboard.map((entry, index) => (
                <motion.li
                  key={entry.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className='flex justify-between items-center p-2 bg-gray-50 rounded-md shadow-sm'
                >
                  <span className='font-medium text-gray-600 flex items-center gap-1'>
                    {entry.username || "Unknown Player"}
                    {index < 3 && (
                      <TrophyIcon
                        className={`w-5 h-5 ${medalColors[index]} ${index === 0 ? "animate-pulse" : ""}`}
                      />
                    )}
                  </span>
                  <span className='text-blue-500 font-bold'>{entry.score}</span>
                </motion.li>
              ))}
            </ul>

            {/* Your Score */}
            {yourScore && isLoggedIn && (
              <motion.div
                className="mt-6 p-4 bg-indigo-50 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h4 className="text-lg font-semibold text-indigo-600 mb-2">Your Score</h4>
                <p className="text-gray-700">
                  <span className="font-bold">{yourScore.username || "You"}</span>: {yourScore.score}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-bold">Rank: {yourScore.rank}</span>
                </p>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleAddPoints(10)}
                    className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    +10 Points
                  </button>
                  <button
                    onClick={handleResetScore}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Reset Score
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Home;
