import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    // Make sure this URL matches your local PHP server path
    // Replace the hardcoded string with the variable
    fetch(`${import.meta.env.VITE_API_URL}?action=get_stations`)
      .then(response => response.json())
      .then(data => setStations(data))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">
        ⛽ List of Gas Stations
      </h2>

      {/* Tailwind Grid Layout: 1 col (mobile), 2 cols (tablet), 3 cols (desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stations.map(branch => (
          <div key={branch.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col transition-colors">
            
            {/* Card Body */}
            <div className="p-6 flex-grow">
              <h4 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                📍 {branch.name}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {branch.location}
              </p>

              {/* Fuels Badges */}
              <div className="flex flex-wrap gap-2">
                {branch.fuels.length === 0 ? (
                  <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                    No fuels assigned
                  </span>
                ) : (
                  branch.fuels.map((fuel, index) => (
                    <span 
                      key={index} 
                      className="inline-block bg-green-600 dark:bg-green-700 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-sm"
                    >
                      {fuel.name} - ₱{Number(fuel.price).toFixed(2)}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Card Footer with Button */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 mt-auto">
              <Link 
                to={`/profile/${branch.id}`} 
                className="block w-full text-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                More Details &rarr;
              </Link>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;