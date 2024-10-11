
import React, { useState, useEffect } from "react";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import default styles
import './App.css';
import marsGif from './assets/marsGif.gif';

function App() {
  // useState to manage weather data
  const [weatherData, setWeatherData] = useState(null); 
  // useState to manage loading state
  const [loading, setLoading] = useState(true); 
  // useState to manage any error during data fetching
  const [error, setError] = useState(null); 
  // useState to store photos for each Sol (Mars day)
  const [photos, setPhotos] = useState({}); 
  // useState to toggle between light and dark themes
  const [isDarkTheme, setIsDarkTheme] = useState(false); 
  // useState to toggle visibility of the Mars globe
  const [showGlobe, setShowGlobe] = useState(true); // New state for globe visibility

  // useEffect is used for fetching data from NASA APIs when the component mounts
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const weatherResponse = await fetch(
          `https://api.nasa.gov/insight_weather/?api_key=Af0NwRAemSXwCDBdtB2J1MZuJOTzfhKMxtD5oTAe&feedtype=json&ver=1.0`
        );
        const weatherData = await weatherResponse.json();
        setWeatherData(weatherData); // Update weather data state

        // Fetch Mars Rover photos for each Sol (Mars day) and pair them with weather data
        const solKeys = weatherData.sol_keys;
        const photoFetches = solKeys.map(async (sol) => {
          const photoResponse = await fetch(
            `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${sol}&api_key=Af0NwRAemSXwCDBdtB2J1MZuJOTzfhKMxtD5oTAe`
          );
          const photoData = await photoResponse.json();
          return { sol, photos: photoData.photos.slice(0, 3) }; // Limit to 3 photos per Sol
        });

        // Combine all the photo results into one object
        const solPhotos = await Promise.all(photoFetches);
        const pairedPhotos = solPhotos.reduce((acc, { sol, photos }) => {
          acc[sol] = photos.length ? photos : []; // Store up to 3 photos per Sol
          return acc;
        }, {});
        setPhotos(pairedPhotos); // Update photos state

        setLoading(false); // Set loading to false once data is fetched
      } catch (err) {
        setError("Failed to fetch data"); // Set error message if fetching fails
        setLoading(false); // Ensure loading is false even if an error occurs
      }
    };

    fetchWeatherData(); // Call the data fetching function
  }, []); 
  // The empty array [] as the second argument ensures this effect runs only once, after the initial render (componentDidMount equivalent)

  if (loading) return <div>Loading Mars Weather and Photos...</div>;
  if (error) return <div>{error}</div>;

  const solKeys = weatherData ? weatherData.sol_keys : [];

  // Function to toggle between light and dark themes
  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme); // Update theme state
  };

  // Function to toggle the visibility of the Mars globe
  const toggleGlobe = () => {
    setShowGlobe((prev) => !prev);
  }

  return (
    <div className={isDarkTheme ? 'dark-theme' : 'light-theme'}>
      <h1>Mars Weather and Photos</h1>
      
      {/* Centered Theme Toggler Button */}
      <div className="theme-toggle-container">
        <button onClick={toggleTheme}>
          Switch to {isDarkTheme ? 'Light' : 'Dark'} Theme
        </button>
      </div>

      {/* Centered Globe Toggler Button */}
      <div className="globe-toggle-container">
        <button onClick={toggleGlobe}>
          {showGlobe ? 'Hide' : 'Show'} Mars Globe
        </button>
      </div>

      {/* Flex container for globe and facts */}
      <div className="globe-facts-container">
        {/* Display the spinning Mars globe */}
        {showGlobe && (
          <div className="globe-container">
            <img src={marsGif} alt="Spinning Mars Globe" className="mars-globe" />
          </div>
        )}
        
        {/* Facts Area */}
        <div className={`facts-container ${isDarkTheme ? 'dark-theme' : ''}`}>
          <h3>Mars Facts</h3>
          <ul>
            <li>Mars is the fourth planet from the Sun.</li>
            <li>Mars is known as the Red Planet due to iron oxide (rust) on its surface.</li>
            <li>The tallest volcano in the solar system, Olympus Mons, is on Mars.</li>
            <li>Mars has two moons: Phobos and Deimos.</li>
            <li>A Martian day is approximately 24 hours and 37 minutes long.</li>
            <li>The average temperature on Mars is about -62 degrees Celsius.</li>
            <li>Mars has the largest dust storms in the solar system, which can cover the entire planet.</li>
            <li>There is evidence that liquid water once flowed on the surface of Mars.</li>
            <li>NASA's Perseverance rover is currently exploring the Jezero Crater on Mars.</li>
            <li>Why did Mars break up with Saturn? Because Saturn had too many rings!</li>
          </ul>
        </div>
      </div>
      
      <div className="weather-container">
        {solKeys.length > 0 ? (
          solKeys.map((sol) => (
            <div key={sol} className="weather-card">
              <h2>Sol {sol}</h2>
              <p>Temperature (High): {weatherData[sol].AT?.mx || "No data"} °C</p>
              <p>Temperature (Low): {weatherData[sol].AT?.mn || "No data"} °C</p>
              <p>Pressure: {weatherData[sol].PRE?.av || "No data"} Pa</p>
              <p>Wind Speed: {weatherData[sol].HWS?.av || "No data"} m/s</p>

              {/* 
                Carousel Component:
                - This carousel component is used to display up to 3 Mars Rover photos for each Sol.
                - `showThumbs={false}`: Hides the thumbnail navigation below the carousel.
                - `infiniteLoop`: Enables continuous looping (after the last image, it goes back to the first).
                - `autoPlay`: Automatically moves to the next image after a delay.
              */}
              {photos[sol] && photos[sol].length > 0 ? (
                <Carousel showThumbs={false} infiniteLoop autoPlay>
                  {photos[sol].map((photo, index) => (
                    <div key={index}>
                      <img src={photo.img_src} alt={`Mars Rover Photo for Sol ${sol}`} />
                    </div>
                  ))}
                </Carousel>
              ) : (
                <p>No photos available for this Sol</p>
              )}
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
