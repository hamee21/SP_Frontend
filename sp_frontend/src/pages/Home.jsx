import { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [error, setError] = useState('');

  // Load all restaurants
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/v1/restaurants');
        setRestaurants(res.data.data);
      } catch (err) {
        setError('Failed to load restaurant list');
      }
    };
    fetchRestaurants();
  }, []);

  // Fetch restaurant detail
  useEffect(() => {
    const fetchDetail = async () => {
      if (!selectedId) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/v1/restaurants/${selectedId}`);
        setSelectedRestaurant(res.data.data);
      } catch (err) {
        setError('Failed to load restaurant detail');
      }
    };
    fetchDetail();
  }, [selectedId]);

  const options = restaurants.map((r) => ({
    value: r._id,
    label: r.name,
  }));

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '25px', color: '#5c1e14' }}>Select a Restaurant</h2>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Select
          options={options}
          placeholder="Search and select restaurant..."
          onChange={(e) => setSelectedId(e.value)}
          isSearchable
        />
      </div>

      {selectedRestaurant && (
        <div className="restaurant-layout">
          {/* Detail Left */}
          <div className="restaurant-card">
            <h3 className="restaurant-name">{selectedRestaurant.name}</h3>
            <div className="restaurant-info">
              <p><strong>Address:</strong> {selectedRestaurant.address}</p>
              <p><strong>Telephone:</strong> {selectedRestaurant.telephone}</p>
              <p><strong>Open - Close:</strong> {selectedRestaurant.openTime} - {selectedRestaurant.closeTime}</p>
              <p><strong>Total Tables:</strong> {selectedRestaurant.totalTables}</p>
            </div>
          </div>

          {/* Map Right */}
          <div className="restaurant-map">
            <iframe
              width="100%"
              height="300"
              style={{ border: 0, borderRadius: '8px' }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${selectedRestaurant.location.latitude},${selectedRestaurant.location.longitude}&hl=es&z=14&output=embed`}
              title="Restaurant Location"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
