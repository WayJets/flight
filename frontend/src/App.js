import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [aircraft, setAircraft] = useState([]);
  const [selectedAircraft, setSelectedAircraft] = useState(null);
  const [stats, setStats] = useState({});
  const [mapCenter] = useState([40.7128, -74.0060]);
  const [zoom] = useState(8);

  // Fetch all aircraft
  useEffect(() => {
    const fetchAircraft = async () => {
      try {
        const response = await axios.get(`${API_URL}/aircraft`);
        setAircraft(response.data);
      } catch (error) {
        console.error('Error fetching aircraft:', error);
      }
    };

    // Initial fetch
    fetchAircraft();

    // Poll every 2 seconds
    const interval = setInterval(fetchAircraft, 2000);
    return () => clearInterval(interval);
  }, []);

  // Fetch statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API_URL}/statistics`);
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1>✈️ Private Flight Tracker</h1>
        <div className="stats">
          <span>Active: {stats.active_aircraft || 0}</span>
          <span>Total: {stats.total_aircraft || 0}</span>
          <span>Tracked: {stats.total_positions_tracked || 0}</span>
        </div>
      </header>

      <div className="container">
        <aside className="sidebar">
          <h2>Aircraft List ({aircraft.length})</h2>
          <div className="aircraft-list">
            {aircraft.map((ac) => (
              <div
                key={ac.icao}
                className="aircraft-item"
                onClick={() => setSelectedAircraft(ac)}
              >
                <div className="callsign">{ac.callsign || ac.icao}</div>
                <div className="details">
                  <span>{ac.altitude ? `${Math.round(ac.altitude)} ft` : '-'}</span>
                  <span>{ac.speed ? `${Math.round(ac.speed)} kt` : '-'}</span>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <main className="map-container">
          <MapContainer
            center={mapCenter}
            zoom={zoom}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />

            {aircraft.map((ac) => (
              ac.lat && ac.lon && (
                <CircleMarker
                  key={ac.icao}
                  center={[ac.lat, ac.lon]}
                  radius={6}
                  fillColor={selectedAircraft?.icao === ac.icao ? '#ff0000' : '#00b4d8'}
                  color={selectedAircraft?.icao === ac.icao ? '#ff0000' : '#0077b6'}
                  weight={2}
                  opacity={0.8}
                  fillOpacity={0.7}
                >
                  <Popup>
                    <div className="popup">
                      <strong>{ac.callsign || ac.icao}</strong>
                      <p>ICAO: {ac.icao}</p>
                      <p>Altitude: {ac.altitude ? `${Math.round(ac.altitude)} ft` : '-'}</p>
                      <p>Speed: {ac.speed ? `${Math.round(ac.speed)} kt` : '-'}</p>
                      <p>Heading: {ac.heading ? `${Math.round(ac.heading)}°` : '-'}</p>
                      <p>Last: {new Date(ac.last_updated).toLocaleTimeString()}</p>
                    </div>
                  </Popup>
                </CircleMarker>
              )
            ))}
          </MapContainer>
        </main>

        {selectedAircraft && (
          <aside className="info-panel">
            <h3>{selectedAircraft.callsign || selectedAircraft.icao}</h3>
            <div className="info">
              <div className="info-row">
                <span className="label">ICAO:</span>
                <span className="value">{selectedAircraft.icao}</span>
              </div>
              <div className="info-row">
                <span className="label">Altitude:</span>
                <span className="value">
                  {selectedAircraft.altitude ? `${Math.round(selectedAircraft.altitude)} ft` : '-'}
                </span>
              </div>
              <div className="info-row">
                <span className="label">Speed:</span>
                <span className="value">
                  {selectedAircraft.speed ? `${Math.round(selectedAircraft.speed)} kt` : '-'}
                </span>
              </div>
              <div className="info-row">
                <span className="label">Heading:</span>
                <span className="value">
                  {selectedAircraft.heading ? `${Math.round(selectedAircraft.heading)}°` : '-'}
                </span>
              </div>
              <div className="info-row">
                <span className="label">Vertical Rate:</span>
                <span className="value">
                  {selectedAircraft.vertical_rate ? `${Math.round(selectedAircraft.vertical_rate)} fpm` : '-'}
                </span>
              </div>
              <div className="info-row">
                <span className="label">On Ground:</span>
                <span className="value">{selectedAircraft.is_on_ground ? 'Yes' : 'No'}</span>
              </div>
              <div className="info-row">
                <span className="label">Position:</span>
                <span className="value">
                  {selectedAircraft.lat && selectedAircraft.lon
                    ? `${selectedAircraft.lat.toFixed(4)}, ${selectedAircraft.lon.toFixed(4)}`
                    : '-'}
                </span>
              </div>
              <div className="info-row">
                <span className="label">Last Update:</span>
                <span className="value">
                  {new Date(selectedAircraft.last_updated).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

export default App;
