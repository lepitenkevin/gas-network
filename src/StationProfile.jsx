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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Review Form */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 sticky top-20">
            <h3 className="text-xl font-bold mb-4 dark:text-white">✍️ Leave a Review</h3>
            
            {status.msg && (
              <div className={`p-3 mb-4 rounded-lg text-sm ${status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                {status.msg}
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <input 
                type="text" placeholder="Your Name" 
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={reviewData.name} onChange={e => setReviewData({...reviewData, name: e.target.value})} required 
              />
              <select 
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={reviewData.rating} onChange={e => setReviewData({...reviewData, rating: e.target.value})}
              >
                {[5, 4, 3, 2, 1].map(num => <option key={num} value={num}>{num} Stars</option>)}
              </select>
              <textarea 
                placeholder="Share your experience..." 
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                rows="3" value={reviewData.comment} onChange={e => setReviewData({...reviewData, comment: e.target.value})} required
              ></textarea>
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">Optional Photo:</label>
                <input 
                  type="file" accept="image/*" 
                  className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  onChange={e => setReviewData({...reviewData, photo: e.target.files[0]})} 
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition">
                Submit for Approval
              </button>
            </form>
          </div>
        </div>

        {/* Display Reviews */}
        <div className="lg:col-span-2">
          <h3 className="text-2xl font-bold mb-6 dark:text-white text-gray-800">Recent Reviews</h3>
          <div className="space-y-6">
            {reviews && reviews.length > 0 ? (
              reviews.map((rev) => (
                <div key={rev.id} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold dark:text-white">{rev.user_name}</h4>
                      <div className="text-yellow-500">
                        {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{new Date(rev.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{rev.comment}</p>
                  {rev.photo_path && (
                    <img 
                      src={`${import.meta.env.VITE_API_MEDIA_URL}${rev.photo_path}`} 
                      alt="Review" 
                      className="rounded-lg max-h-64 object-cover border dark:border-gray-600" 
                    />
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No approved reviews yet. Be the first to leave one!</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default StationProfile;