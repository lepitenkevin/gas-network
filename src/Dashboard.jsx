import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [stations, setStations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name"); // Default sort by name

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}?action=get_stations`)
      .then(response => response.json())
      .then(data => setStations(data))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  // 1. Filter Logic: Search by Name or Location
  const filteredStations = stations.filter(station => 
    station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    station.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. Sorting Logic
  const sortedStations = [...filteredStations].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === "price_low") {
      // Sorts by the first fuel price found at each station
      const priceA = a.fuels[0]?.price || 999;
      const priceB = b.fuels[0]?.price || 999;
      return priceA - priceB;
    }
    return 0;
  });

  return (
    <div className="pb-10">
      {/* Header & Controls Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">
          ⛽ Bogo Gas Stations
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-grow sm:w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input 
              type="text" 
              placeholder="Search station or street..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Sort Dropdown */}
          <select 
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Sort: A-Z</option>
            <option value="price_low">Sort: Lowest Price</option>
          </select>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedStations.length > 0 ? (
          sortedStations.map(branch => (
            <div key={branch.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transform border border-gray-100 dark:border-gray-700 flex flex-col transition-all duration-300">
              
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {branch.name}
                  </h4>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 flex items-center gap-1">
                  📍 {branch.location}
                </p>

                <div className="space-y-3">
                  {branch.fuels.length === 0 ? (
                    <p className="text-sm text-gray-400 italic">Updating fuel prices...</p>
                  ) : (
                    branch.fuels.map((fuel, index) => (
                      <div key={index} className="flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg">
                        <span className="text-sm font-medium dark:text-gray-300">{fuel.name}</span>
                        <span className="text-sm font-bold text-green-600 dark:text-green-400">₱{Number(fuel.price).toFixed(2)}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="p-4 mt-auto">
                <Link 
                  to={`/profile/${branch.id}`} 
                  className="block w-full text-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-sm font-bold hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all"
                >
                  View Details & Reviews
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <p className="text-gray-400 text-lg italic">No stations found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;