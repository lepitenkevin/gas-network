import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [stations, setStations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name"); 
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}?action=get_stations`)
      .then(response => response.json())
      .then(data => setStations(data))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  // 1. FILTER LOGIC: Search Text + Category Filter
  const filteredStations = stations.filter(station => {
    // Check if it matches text search
    const matchesSearch = 
      station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.location.toLowerCase().includes(searchTerm.toLowerCase());

    // Check if it matches the selected fuel category
    const matchesCategory = 
      filterCategory === "all" || 
      station.fuels.some(f => f.category === filterCategory);

    return matchesSearch && matchesCategory;
  });

  // 2. SORTING LOGIC (Runs on the already filtered list)
  const sortedStations = [...filteredStations].sort((a, b) => {
    
    const getPriceByCategory = (station, category) => {
      const fuel = station.fuels.find(f => f.category === category);
      return fuel ? Number(fuel.price) : Infinity; 
    };

    const getMinOverallPrice = (station) => {
      if (station.fuels.length === 0) return Infinity;
      return Math.min(...station.fuels.map(f => Number(f.price)));
    };

    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "name_desc") return b.name.localeCompare(a.name);
    if (sortBy === "diesel_low") return getPriceByCategory(a, 'diesel') - getPriceByCategory(b, 'diesel');
    if (sortBy === "premium_low") return getPriceByCategory(a, 'premium') - getPriceByCategory(b, 'premium');
    if (sortBy === "unleaded_low") return getPriceByCategory(a, 'unleaded') - getPriceByCategory(b, 'unleaded');
    if (sortBy === "any_low") return getMinOverallPrice(a) - getMinOverallPrice(b);
    if (sortBy === "most_options") return b.fuels.length - a.fuels.length;

    return 0;
  });

  return (
    <div className="pb-10">
      {/* Header & Controls Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">
          ⛽ List of Gas Stations
        </h2>

        <div className="flex flex-col lg:flex-row gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-grow lg:w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input 
              type="text" 
              placeholder="Search station or street..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {/* NEW: Fixed Contrast Filter Dropdown */}
            <select 
              className="w-full sm:flex-1 px-4 py-2 rounded-lg border border-blue-300 dark:border-gray-700 bg-blue-50 dark:bg-gray-800 text-blue-800 dark:text-white font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer shadow-sm"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">⛽ All Fuel Types</option>
              <option value="unleaded" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">🟢 Unleaded Only</option>
              <option value="premium" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">🔴 Premium Only</option>
              <option value="diesel" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">⚫ Diesel Only</option>
            </select>

            {/* Fixed Contrast Sort Dropdown */}
            <select 
              className="w-full sm:flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer font-medium shadow-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <optgroup label="Alphabetical" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                <option value="name" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">A to Z</option>
                <option value="name_desc" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Z to A</option>
              </optgroup>
              <optgroup label="Find Cheapest Gas" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                <option value="any_low" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">📉 Cheapest Overall</option>
                <option value="unleaded_low" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">🟢 Lowest Unleaded</option>
                <option value="premium_low" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">🔴 Lowest Premium</option>
                <option value="diesel_low" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">⚫ Lowest Diesel</option>
              </optgroup>
              <optgroup label="Station Info" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                <option value="most_options" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">⛽ Most Fuel Options</option>
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedStations.length > 0 ? (
          sortedStations.map(branch => {
            const fuelsToDisplay = filterCategory === "all" 
              ? branch.fuels 
              : branch.fuels.filter(f => f.category === filterCategory);

            return (
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
                      fuelsToDisplay.map((fuel, index) => (
                        <div 
                          key={index} 
                          className="flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg"
                        >
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white shadow-sm transition-colors ${
                            fuel.color === 'red' ? 'bg-red-600 dark:bg-red-700' : 
                            fuel.color === 'gray' ? 'bg-gray-600 dark:bg-gray-700' : 
                            'bg-green-600 dark:bg-green-700'
                          }`}>
                            {fuel.name}
                          </span>
                          
                          <span className="text-sm font-bold text-green-600 dark:text-green-400">
                            ₱{Number(fuel.price).toFixed(2)}
                          </span>
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
            );
          })
        ) : (
          <div className="col-span-full py-20 text-center">
            <p className="text-gray-400 text-lg italic">
              {filterCategory === "all" 
                ? `No stations found matching "${searchTerm}"` 
                : `No stations found matching "${searchTerm}" with ${filterCategory} gas.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;