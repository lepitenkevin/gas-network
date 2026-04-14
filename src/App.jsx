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

  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile && !isStandalone) {
      const timer = setTimeout(() => setShowInstallBanner(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [isDark]);

  return (
    <Router>
      <Analytics />
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        
        <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50 transition-all">
          <Link to="/" className="text-xl md:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#007bff] to-[#ef8b10] hover:opacity-80 transition-opacity tracking-tight">
            ⛽ GasNet
          </Link>
          
          <div className="flex items-center gap-4 md:gap-6">
            <Link to="/contact" className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-[#ef8b10] dark:hover:text-[#ef8b10] transition-colors">
              Contact
            </Link>
            
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-[#007bff]/10 hover:text-[#007bff] dark:hover:bg-[#ef8b10]/20 dark:hover:text-[#ef8b10] transition-all shadow-inner"
              title="Toggle Dark Mode"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 py-8 flex-grow w-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile/:id" element={<StationProfile />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        {showInstallBanner && (
          <div className="fixed bottom-4 left-4 right-4 z-[100] bg-gradient-to-r from-[#007bff] to-[#0056b3] text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between animate-in fade-in slide-in-from-bottom-5 duration-500 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2.5 rounded-xl text-xl backdrop-blur-sm">📲</div>
              <div>
                <p className="font-bold text-sm">Install Gas Network</p>
                <p className="text-xs text-blue-100">Tap Share &gt; "Add to Home Screen"</p>
              </div>
            </div>
            <button 
              onClick={() => setShowInstallBanner(false)}
              className="ml-4 bg-[#ef8b10] hover:bg-[#d67a0c] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-md"
            >
              Got it
            </button>
          </div>
        )}

        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-10 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-10">
              
              <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                  <img 
                    src="/qr-code.png" 
                    alt="Scan to open on mobile" 
                    className="w-24 h-24 object-contain rounded-xl"
                  />
                  <p className="text-[10px] text-center text-[#007bff] mt-1.5 font-bold uppercase tracking-tighter">Scan App</p>
                </div>

                <div>
                  <h2 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#007bff] to-[#ef8b10]">Fuel Gas Station Network</h2>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2 max-w-xs leading-relaxed">
                    Crowdsourced gas prices for the PH community. Help others save at the pump!
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-8 text-sm font-bold text-gray-500 dark:text-gray-400">
                <Link to="/" className="hover:text-[#007bff] transition-colors">Dashboard</Link>
                <Link to="/contact" className="hover:text-[#ef8b10] transition-colors">Support</Link>
                <a 
                  href="https://discord.gg/VYH8F4RE" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-[#007bff] transition-colors"
                >
                  Discord
                </a>
                <a 
                  href="https://facebook.com/varcharnamekevin" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-[#ef8b10] transition-colors"
                >
                  Developer
                </a>
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-gray-400 dark:text-gray-500">
              <p>© {currentYear} Kevin Lepiten. All rights reserved.</p>
              <div className="flex items-center gap-2">
                <span>Handcrafted in Cebu, Philippines</span>
                <span className="text-lg">🇵🇭</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;