// import React, { useState, useEffect } from "react";
// import './App.css'; // Make sure to import the CSS file

// function App() {
//   const [weatherData, setWeatherData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchWeatherData = async () => {
//       try {
//         const response = await fetch(
//           `https://api.nasa.gov/insight_weather/?api_key=Af0NwRAemSXwCDBdtB2J1MZuJOTzfhKMxtD5oTAe&feedtype=json&ver=1.0`
//         );
//         const data = await response.json();
//         setWeatherData(data);
//         setLoading(false);
//       } catch (err) {
//         setError("Failed to fetch data");
//         setLoading(false);
//       }
//     };

//     fetchWeatherData();
//   }, []);

//   if (loading) return <div>Loading Mars Weather...</div>;
//   if (error) return <div>{error}</div>;

//   const solKeys = weatherData ? weatherData.sol_keys : [];

//   return (
//     <div>
//       <h1>Mars Weather</h1>
//       <div className="weather-container">
//         {solKeys.length > 0 ? (
//           solKeys.map((sol) => (
//             <div key={sol} className="weather-card">
//               <h2>Sol {sol}</h2>
//               <p>Temperature (High): {weatherData[sol].AT?.mx || "No data"} °C</p>
//               <p>Temperature (Low): {weatherData[sol].AT?.mn || "No data"} °C</p>
//               <p>Pressure: {weatherData[sol].PRE?.av || "No data"} Pa</p>
//               <p>Wind Speed: {weatherData[sol].HWS?.av || "No data"} m/s</p>
//             </div>
//           ))
//         ) : (
//           <div>No weather data available</div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;


// -----------

import React, { useState, useEffect } from "react";
import './App.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [photos, setPhotos] = useState({}); // Store photos for each Sol

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const weatherResponse = await fetch(
          `https://api.nasa.gov/insight_weather/?api_key=Af0NwRAemSXwCDBdtB2J1MZuJOTzfhKMxtD5oTAe&feedtype=json&ver=1.0`
        );
        const weatherData = await weatherResponse.json();
        setWeatherData(weatherData);

        // Now, fetch Mars photos for each Sol
        const solKeys = weatherData.sol_keys;
        solKeys.forEach(async (sol) => {
          const photoResponse = await fetch(
            `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${sol}&api_key=Af0NwRAemSXwCDBdtB2J1MZuJOTzfhKMxtD5oTAe`
          );
          const photoData = await photoResponse.json();
          setPhotos((prevPhotos) => ({
            ...prevPhotos,
            [sol]: photoData.photos.slice(0, 3) // Limit to 3 photos per Sol for now
          }));
        });

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  if (loading) return <div>Loading Mars Weather and Photos...</div>;
  if (error) return <div>{error}</div>;

  const solKeys = weatherData ? weatherData.sol_keys : [];

  return (
    <div>
      <h1>Mars Weather and Photos</h1>
      <div className="weather-container">
        {solKeys.length > 0 ? (
          solKeys.map((sol) => (
            <div key={sol} className="weather-card">
              <h2>Sol {sol}</h2>
              <p>Temperature (High): {weatherData[sol].AT?.mx || "No data"} °C</p>
              <p>Temperature (Low): {weatherData[sol].AT?.mn || "No data"} °C</p>
              <p>Pressure: {weatherData[sol].PRE?.av || "No data"} Pa</p>
              <p>Wind Speed: {weatherData[sol].HWS?.av || "No data"} m/s</p>

              {/* Display Mars photos */}
              <div className="photos">
                {photos[sol] && photos[sol].length > 0 ? (
                  photos[sol].map((photo, index) => (
                    <img
                      key={index}
                      src={photo.img_src}
                      alt={`Mars Rover Photo for Sol ${sol}`}
                      className="mars-photo"
                    />
                  ))
                ) : (
                  <p>No photos available for this Sol</p>
                )}
              </div>
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


// --------

