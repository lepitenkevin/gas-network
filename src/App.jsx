import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import StationProfile from './StationProfile';

function App() {
  // Check local storage for theme preference, default to light
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    // Add or remove the 'dark' class on the HTML element
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <Router>
      <div className="min-h-screen">
        {/* Global Navigation Bar with Theme Toggle */}
        <nav className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4 flex justify-between items-center transition-colors">
          <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">Fuel Gas Station Network</h1>
          <button 
            onClick={() => setIsDark(!isDark)}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </nav>

        {/* Page Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile/:id" element={<StationProfile />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;