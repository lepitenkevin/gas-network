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

  // State to control the PWA Installation Banner
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    // 1. Theme Logic
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    // 2. PWA Logic: Show banner if on mobile and NOT already installed (standalone)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile && !isStandalone) {
      // Small delay so it doesn't pop up instantly
      const timer = setTimeout(() => setShowInstallBanner(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [isDark]);

  return (
    <Router>
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

        {/* --- Page Content --- */}
        <main className="max-w-7xl mx-auto px-4 py-8 flex-grow w-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile/:id" element={<StationProfile />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        {/* --- PWA Install Banner (Visible on Mobile Only) --- */}
        {showInstallBanner && (
          <div className="fixed bottom-4 left-4 right-4 z-[100] bg-blue-600 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl text-xl">📲</div>
              <div>
                <p className="font-bold text-sm">Install Gas Network</p>
                <p className="text-xs opacity-90">Tap Share &gt; "Add to Home Screen"</p>
              </div>
            </div>
            <button 
              onClick={() => setShowInstallBanner(false)}
              className="ml-4 bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg text-xs font-bold transition"
            >
              Got it
            </button>
          </div>
        )}

        {/* --- Footer Section --- */}
        {/* --- Footer Section --- */}
<footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-10">
  <div className="max-w-7xl mx-auto px-6 py-10">
    <div className="flex flex-col md:flex-row justify-between items-center gap-10">
      
      {/* Brand & QR Code Section */}
      <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
        {/* QR Code Image */}
        <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <img 
            src="/qr-code.png" 
            alt="Scan to open on mobile" 
            className="w-24 h-24 object-contain"
          />
          <p className="text-[10px] text-center text-gray-400 mt-1 font-bold uppercase tracking-tighter">Scan to Mobile</p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">Fuel Gas Station Network</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
            Crowdsourced gas prices for the PH community. Help others save at the pump!
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-400">
        <Link to="/" className="hover:text-blue-600 transition">Dashboard</Link>
        <Link to="/contact" className="hover:text-blue-600 transition">Support</Link>
        <a 
          href="https://discord.gg/VYH8F4RE" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:text-indigo-500 transition"
        >
          Discord
        </a>
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

    {/* Bottom Copyright Bar */}
    <div className="border-t border-gray-100 dark:border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
      <p>© {currentYear} Kevin Lepiten. All rights reserved.</p>
      <div className="flex items-center gap-2">
        <span>Handcrafted in Cebu, Philippines</span>
        <span className="text-base">🇵🇭</span>
      </div>
    </div>
  </div>
</footer>
      </div>
    </Router>
  );
}

export default App;