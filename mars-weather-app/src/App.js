import React, { useState, useEffect } from "react";
import './App.css'; // Make sure to import the CSS file

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(
          `https://api.nasa.gov/insight_weather/?api_key=Af0NwRAemSXwCDBdtB2J1MZuJOTzfhKMxtD5oTAe&feedtype=json&ver=1.0`
        );
        const data = await response.json();
        setWeatherData(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  if (loading) return <div>Loading Mars Weather...</div>;
  if (error) return <div>{error}</div>;

  const solKeys = weatherData ? weatherData.sol_keys : [];

  return (
    <div>
      <h1>Mars Weather</h1>
      <div className="weather-container">
        {solKeys.length > 0 ? (
          solKeys.map((sol) => (
            <div key={sol} className="weather-card">
              <h2>Sol {sol}</h2>
              <p>Temperature (High): {weatherData[sol].AT?.mx || "No data"} °C</p>
              <p>Temperature (Low): {weatherData[sol].AT?.mn || "No data"} °C</p>
              <p>Pressure: {weatherData[sol].PRE?.av || "No data"} Pa</p>
              <p>Wind Speed: {weatherData[sol].HWS?.av || "No data"} m/s</p>
            </div>
          ))
        ) : (
          <div>No weather data available</div>
        )}
      </div>
    </div>
  );
}

export default App;