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

  const filteredStations = stations.filter(station => {
    const matchesSearch = 
      station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = 
      filterCategory === "all" || 
      station.fuels.some(f => f.category === filterCategory);

    return matchesSearch && matchesCategory;
  });

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
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#007bff] to-[#ef8b10] tracking-tight">
          ⛽ List of Gas Stations
        </h2>

        <div className="flex flex-col lg:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow lg:w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input 
              type="text" 
              placeholder="Search station or street..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-[#007bff] focus:border-transparent transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <select 
              className="w-full sm:flex-1 px-4 py-2.5 rounded-xl border border-[#ef8b10]/30 dark:border-[#ef8b10]/50 bg-[#ef8b10]/5 dark:bg-[#ef8b10]/10 text-[#ef8b10] dark:text-[#ef8b10] font-bold outline-none focus:ring-2 focus:ring-[#ef8b10] transition-all cursor-pointer shadow-sm"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">⛽ All Fuel Types</option>
              <option value="unleaded" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">🟢 Unleaded Only</option>
              <option value="premium" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">🔴 Premium Only</option>
              <option value="diesel" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">⚫ Diesel Only</option>
            </select>

            <select 
              className="w-full sm:flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-[#007bff] transition-all cursor-pointer font-medium shadow-sm"
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedStations.length > 0 ? (
          sortedStations.map(branch => {
            const fuelsToDisplay = filterCategory === "all" 
              ? branch.fuels 
              : branch.fuels.filter(f => f.category === filterCategory);

            return (
              <div key={branch.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-[#007bff]/20 dark:hover:shadow-[#007bff]/30 hover:-translate-y-1 transform border border-gray-100 dark:border-gray-700 hover:border-[#007bff]/30 dark:hover:border-[#007bff]/50 flex flex-col transition-all duration-300">
                
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-xl font-extrabold text-gray-900 dark:text-white">
                      {branch.name}
                    </h4>
                  </div>
                  <p className="text-sm text-[#ef8b10] font-medium mb-5 flex items-center gap-1">
                    📍 {branch.location}
                  </p>

                  <div className="space-y-3">
                    {branch.fuels.length === 0 ? (
                      <p className="text-sm text-gray-400 italic">Updating fuel prices...</p>
                    ) : (
                      fuelsToDisplay.map((fuel, index) => (
                        <div 
                          key={index} 
                          className="flex justify-between items-center bg-gray-50 dark:bg-gray-900/60 p-2.5 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-colors"
                        >
                          <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest text-white shadow-sm ${
                            fuel.color === 'red' ? 'bg-red-600 dark:bg-red-700' : 
                            fuel.color === 'gray' ? 'bg-gray-600 dark:bg-gray-700' : 
                            'bg-emerald-500 dark:bg-emerald-600'
                          }`}>
                            {fuel.name}
                          </span>
                          
                          <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                            ₱{Number(fuel.price).toFixed(2)}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="p-4 mt-auto border-t border-gray-100 dark:border-gray-700/50">
                  <Link 
                    to={`/profile/${branch.id}`} 
                    className="block w-full text-center px-4 py-2.5 bg-[#007bff]/10 dark:bg-[#007bff]/20 text-[#007bff] dark:text-[#66b0ff] rounded-xl text-sm font-bold hover:bg-[#007bff] hover:text-white dark:hover:bg-[#007bff] dark:hover:text-white transition-all duration-300"
                  >
                    View Station Details
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-24 text-center">
            <div className="text-6xl mb-4">🪫</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
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