import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './Dashboard';
import StationProfile from './StationProfile';
import Contact from './pages/Contact'; 
import { Analytics } from "@vercel/analytics/react"

function App() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const currentYear = new Date().getFullYear();

  useEffect(() => {
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
      {/* flex flex-col min-h-screen ensures footer stays at the bottom */}
      <Analytics />
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
        
        {/* --- Global Navigation Bar --- */}
        <nav className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-50">
          <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400 hover:opacity-80 transition">
            ⛽ Fuel Gas Station Network
          </Link>
          
          <div className="flex items-center gap-6">
            <Link to="/contact" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition">
              Contact Us
            </Link>
            <button 
              onClick={() => setIsDark(!isDark)}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>
        </nav>

        {/* --- Page Content (flex-grow fills the space) --- */}
        <main className="max-w-7xl mx-auto px-4 py-8 flex-grow w-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile/:id" element={<StationProfile />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        {/* --- Footer Section --- */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-10">
          <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              
              <div className="text-center md:text-left">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">Fuel Gas Station Network</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Crowdsourced gas prices for the PH community.
                </p>
              </div>

              <div className="flex gap-8 text-sm font-medium text-gray-600 dark:text-gray-400">
                <Link to="/" className="hover:text-blue-600 transition">Dashboard</Link>
                <Link to="/contact" className="hover:text-blue-600 transition">Support</Link>
                <a 
                  href="https://facebook.com/varcharnamekevin" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-blue-600 transition"
                >
                  Developer
                </a>
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
              <p>© {currentYear} Kevin Lepiten. All rights reserved.</p>
              <p>Handcrafted in Cebu, Philippines 🇵🇭</p>
            </div>
          </div>
        </footer>

      </div>
    </Router>
  );
}

export default App;