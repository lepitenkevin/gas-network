import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

function StationProfile() {
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);
  
  const [reviewData, setReviewData] = useState({ name: '', rating: 5, comment: '', photo: null });
  const [status, setStatus] = useState({ type: '', msg: '' });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}?action=get_station_profile&id=${id}`)
      .then(response => response.json())
      .then(data => setProfileData(data))
      .catch(error => console.error("Error fetching profile:", error));
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setStatus({ type: 'info', msg: 'Submitting...' });

    const formData = new FormData();
    formData.append('action', 'submit_review');
    formData.append('station_id', id);
    formData.append('user_name', reviewData.name);
    formData.append('rating', reviewData.rating);
    formData.append('comment', reviewData.comment);
    if (reviewData.photo) formData.append('photo', reviewData.photo);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}`, {
        method: 'POST',
        body: formData, 
      });
      const result = await res.json();
      
      setStatus({ type: result.status, msg: result.message });
      
      if (result.status === 'success') {
        setReviewData({ name: '', rating: 5, comment: '', photo: null });
        e.target.reset(); 
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'Failed to connect to server.' });
    }
  };

  const handleShare = () => {
    const today = new Date().toLocaleDateString('en-PH', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });

    const fuelList = fuels.length > 0 
        ? fuels.map(f => `🔹 ${f.gas_name}: ₱${Number(f.price).toFixed(2)}`).join('\n')
        : "Updating latest prices...";

    const shareText = `⛽ Gas Price Update: ${station.name}\n📍 ${station.location}\n📅 As of ${today}\n\n${fuelList}\n\nCheck more stations here:`;

    if (navigator.share) {
        navigator.share({
        title: `Gas Prices at ${station.name}`,
        text: shareText,
        url: window.location.href,
        }).catch(err => console.log('Share failed', err));
    } else {
        navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
        alert("Price update copied to clipboard! You can now paste it on Facebook.");
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
    }
  };

  if (!profileData) return <div className="text-center mt-10 text-lg font-medium text-gray-500 dark:text-gray-400 animate-pulse">Loading station details...</div>;

  const { station, fuels, reviews } = profileData; 
  const lat = station.latitude ? parseFloat(station.latitude) : 11.0500;
  const lng = station.longitude ? parseFloat(station.longitude) : 124.0000;
  const position = [lat, lng];

  return (
    <div className="pb-20">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Link to="/" className="inline-block px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:border-[#007bff]/50 hover:text-[#007bff] dark:hover:text-[#007bff] hover:shadow-md hover:shadow-[#007bff]/10 transition-all duration-300">
          &larr; Back to Stations
        </Link>

        <button 
          onClick={handleShare}
          className="flex items-center gap-2 bg-gradient-to-r from-[#ef8b10] to-[#d67a0c] hover:opacity-90 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-[#ef8b10]/30 active:scale-95"
        >
          <span>📤</span> Share Station
        </button>
      </div>

      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold flex items-center gap-2">
          📍 <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#007bff] to-[#ef8b10] tracking-tight">{station.name}</span>
        </h1>
        <h4 className="text-lg text-gray-500 dark:text-gray-400 mt-2 font-medium">{station.location}</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* LEFT COLUMN: Map View */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:shadow-[#007bff]/10 transition-all duration-300">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-5 py-4 text-white font-extrabold text-lg">
            🗺️ Location Map
          </div>
          <div className="h-96 w-full z-0 relative">
            <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%', zIndex: 1 }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {station.latitude && station.longitude && (
                <Marker position={position}>
                  <Popup><strong>{station.name}</strong><br />{station.location}</Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        </div>

        {/* RIGHT COLUMN: Fuel Prices */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:shadow-[#007bff]/10 transition-all duration-300">
          <div className="bg-gradient-to-r from-[#007bff] to-[#0056b3] px-5 py-4 text-white font-extrabold text-lg">
            ⛽ Current Fuel Prices
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-6 py-4">Gas Type</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {fuels.length === 0 ? (
                  <tr><td colSpan="3" className="px-6 py-10 text-center italic text-gray-400 font-medium">No fuels available.</td></tr>
                ) : (
                  fuels.map(f => (
                    <tr key={f.fuel_id} className="hover:bg-[#007bff]/5 dark:hover:bg-[#007bff]/10 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="font-extrabold text-gray-900 dark:text-white text-base">
                          {f.gas_name}
                        </div>
                        {f.category && (
                          <span className={`inline-block mt-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest text-white shadow-sm ${
                            f.color === 'red' ? 'bg-red-600 dark:bg-red-700' : 
                            f.color === 'gray' ? 'bg-gray-500 dark:bg-gray-600' : 
                            'bg-emerald-500 dark:bg-emerald-600'
                          }`}>
                            {f.category}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5 font-black text-[#007bff] dark:text-[#66b0ff] text-xl group-hover:scale-105 transition-transform origin-left">
                        ₱{Number(f.price).toFixed(2)}
                      </td>
                      <td className="px-6 py-5 text-gray-400 dark:text-gray-500 text-xs font-medium">
                        {new Date(f.updated_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- CROWDSOURCED PRICE UPDATES SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Update Form */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-[#ef8b10]/10 border border-gray-100 dark:border-gray-700 sticky top-24 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#ef8b10]/10 dark:bg-[#ef8b10]/20 flex items-center justify-center rounded-2xl text-2xl">📸</div>
              <h3 className="text-xl font-extrabold dark:text-white">Update Prices</h3>
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 font-medium leading-relaxed">
              Help the community! Upload a photo of the station's current price board.
            </p>
            
            {status.msg && (
              <div className={`p-4 mb-6 rounded-xl text-sm font-bold ${status.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-[#007bff]/10 text-[#007bff]'}`}>
                {status.msg}
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Contributor Name</label>
                <input 
                  type="text" placeholder="e.g. Juan Dela Cruz" 
                  className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl dark:bg-gray-900/50 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-[#007bff] focus:border-transparent outline-none transition-all shadow-sm"
                  value={reviewData.name} onChange={e => setReviewData({...reviewData, name: e.target.value})} required 
                />
              </div>

              <div className="p-6 border-2 border-dashed border-[#007bff]/30 hover:border-[#007bff] dark:border-gray-600 dark:hover:border-[#007bff] rounded-2xl text-center bg-[#007bff]/5 dark:bg-gray-900/50 transition-colors">
                <label className="cursor-pointer block">
                  <span className="text-4xl block mb-3">📷</span>
                  <span className="text-sm font-extrabold text-[#007bff] dark:text-[#66b0ff]">
                    {reviewData.photo ? "Photo Selected ✅" : "Upload Price Board Photo"}
                  </span>
                  <input 
                    type="file" accept="image/*" 
                    className="hidden"
                    onChange={e => setReviewData({...reviewData, photo: e.target.files[0]})} 
                    required 
                  />
                  {reviewData.photo && <p className="text-xs text-gray-500 mt-2 font-medium">{reviewData.photo.name}</p>}
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Additional Notes (Optional)</label>
                <textarea 
                  placeholder="e.g. Prices updated just now...." 
                  className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl dark:bg-gray-900/50 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-[#007bff] focus:border-transparent outline-none transition-all shadow-sm" 
                  rows="3" value={reviewData.comment} onChange={e => setReviewData({...reviewData, comment: e.target.value})}
                ></textarea>
              </div>

              <div className="hidden">
                  <input type="hidden" value="5" />
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-[#007bff] to-[#0056b3] text-white py-4 rounded-xl font-extrabold hover:shadow-lg hover:shadow-[#007bff]/30 hover:opacity-90 transition-all active:scale-95">
                Submit Price Update
              </button>
            </form>
          </div>
        </div>

        {/* Display Community Photos/Updates */}
        <div className="lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
            <h3 className="text-2xl font-extrabold dark:text-white text-gray-900">Community Proof</h3>
            <span className="text-xs uppercase tracking-widest bg-[#007bff]/10 dark:bg-[#007bff]/20 text-[#007bff] dark:text-[#66b0ff] px-4 py-2 rounded-full font-bold">Verified Photos</span>
          </div>

          <div className="space-y-8">
            {reviews && reviews.length > 0 ? (
              reviews.map((rev) => (
                <div key={rev.id} className="bg-white dark:bg-gray-800 p-1.5 rounded-3xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700 overflow-hidden">
                  {rev.photo_path && (
                    <div className="relative group rounded-2xl overflow-hidden">
                      <img 
                        src={`${import.meta.env.VITE_API_MEDIA_URL}${rev.photo_path}`} 
                        alt="Station Price List" 
                        className="w-full h-auto max-h-[500px] object-cover bg-gray-50 dark:bg-gray-900 transform group-hover:scale-[1.02] transition-transform duration-500" 
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent text-white">
                          <p className="text-xs font-medium opacity-90 uppercase tracking-widest">Photo proof submitted on {new Date(rev.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#007bff] to-[#ef8b10] flex items-center justify-center text-white text-sm font-black shadow-inner">
                        {rev.user_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-base text-gray-900 dark:text-white">{rev.user_name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-0.5">"{rev.comment}"</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-24 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-3xl bg-gray-50 dark:bg-gray-800/50">
                <div className="text-5xl mb-4 opacity-50">📱</div>
                <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">No community photos yet. Be the hero of Bogo City and upload one!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StationProfile;