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
  
  // States for Review Form
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
        body: formData, // FormData automatically sets the correct Content-Type for uploads
      });
      const result = await res.json();
      
      setStatus({ type: result.status, msg: result.message });
      
      if (result.status === 'success') {
        setReviewData({ name: '', rating: 5, comment: '', photo: null });
        e.target.reset(); // Clear the file input
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'Failed to connect to server.' });
    }
  };

  if (!profileData) return <div className="text-center mt-10 text-lg">Loading station details...</div>;

  const { station, fuels, reviews } = profileData; // Assuming backend now returns approved reviews
  const lat = station.latitude ? parseFloat(station.latitude) : 11.0500;
  const lng = station.longitude ? parseFloat(station.longitude) : 124.0000;
  const position = [lat, lng];

  return (
    <div className="pb-20">
      <div className="mb-6">
        <Link to="/" className="inline-block px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
          &larr; Back to Stations
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
          📍 {station.name}
        </h1>
        <h4 className="text-xl text-gray-500 dark:text-gray-400 mt-1">{station.location}</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* LEFT COLUMN: Map View */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="bg-gray-800 dark:bg-gray-900 px-4 py-3 text-white font-semibold text-lg">
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
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="bg-green-600 dark:bg-green-700 px-4 py-3 text-white font-semibold text-lg">
            ⛽ Current Fuel Prices
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                <tr>
                  <th className="px-6 py-4">Gas Type</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {fuels.length === 0 ? (
                  <tr><td colSpan="3" className="px-6 py-8 text-center italic">No fuels available.</td></tr>
                ) : (
                  fuels.map(f => (
                    <tr key={f.fuel_id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{f.gas_name}</td>
                      <td className="px-6 py-4 font-bold text-green-600 dark:text-green-400 text-lg">₱{Number(f.price).toFixed(2)}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{new Date(f.updated_at).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- REVIEW SECTION --- */}
      {/* --- CROWDSOURCED PRICE UPDATES SECTION --- */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  
  {/* Update Form */}
  <div className="lg:col-span-1">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-blue-100 dark:border-blue-900 sticky top-20">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">📸</span>
        <h3 className="text-xl font-bold dark:text-white">Update Prices</h3>
      </div>
      
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Help the community! Upload a photo of the station's current price board.
      </p>
      
      {status.msg && (
        <div className={`p-3 mb-4 rounded-lg text-sm font-medium ${status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
          {status.msg}
        </div>
      )}

      <form onSubmit={handleSubmitReview} className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Contributor Name</label>
          <input 
            type="text" placeholder="e.g. Juan Dela Cruz" 
            className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            value={reviewData.name} onChange={e => setReviewData({...reviewData, name: e.target.value})} required 
          />
        </div>

        {/* Mandatory Photo Upload with Preview Style */}
        <div className="p-4 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg text-center bg-gray-50 dark:bg-gray-900">
          <label className="cursor-pointer block">
            <span className="text-3xl block mb-2">📷</span>
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
              {reviewData.photo ? "Photo Selected ✅" : "Upload Price Board Photo"}
            </span>
            <input 
              type="file" accept="image/*" 
              className="hidden"
              onChange={e => setReviewData({...reviewData, photo: e.target.files[0]})} 
              required // Make photo mandatory for price validation
            />
            {reviewData.photo && <p className="text-xs text-gray-400 mt-1">{reviewData.photo.name}</p>}
          </label>
        </div>

        {/* Comment / Note */}
        <div>
          <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Additional Notes (Optional)</label>
          <textarea 
            placeholder="e.g. Prices updated just now...." 
            className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" 
            rows="3" value={reviewData.comment} onChange={e => setReviewData({...reviewData, comment: e.target.value})}
          ></textarea>
        </div>

        {/* Rating as 'Confidence' or 'Accuracy' */}
        <div className="hidden"> {/* We can hide this or use it as a 5-star 'Reliability' rating */}
            <input type="hidden" value="5" />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 shadow-blue-200 dark:shadow-none shadow-lg transition-all active:scale-95">
          Submit Price Update
        </button>
      </form>
    </div>
  </div>

  {/* Display Community Photos/Updates */}
  <div className="lg:col-span-2">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-2xl font-bold dark:text-white text-gray-800">Community Proof</h3>
      <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">Verified Photos</span>
    </div>

    <div className="space-y-6">
      {reviews && reviews.length > 0 ? (
        reviews.map((rev) => (
          <div key={rev.id} className="bg-white dark:bg-gray-800 p-1 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            {/* The Photo is now the Hero of the card */}
            {rev.photo_path && (
              <div className="relative group">
                <img 
                  src={`${import.meta.env.VITE_API_MEDIA_URL}${rev.photo_path}`} 
                  alt="Station Price List" 
                  className="w-full h-auto max-h-[500px] object-contain bg-gray-100 dark:bg-black" 
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                    <p className="text-xs opacity-80">Photo proof submitted on {new Date(rev.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            )}
            
            <div className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                  {rev.user_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-sm dark:text-white">{rev.user_name}</h4>
                  <p className="text-xs text-gray-400 italic">"{rev.comment}"</p>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
          <p className="text-gray-400">No community photos yet. Be the hero of Bogo City and upload one!</p>
        </div>
      )}
    </div>
  </div>
</div>
    </div>
  );
}

export default StationProfile;