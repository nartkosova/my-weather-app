import React, { useState } from 'react';
import axios from 'axios';

interface Forecast {
  date: string;
  date_epoch: number;
  day: {
    maxtemp_c: number;
    mintemp_c: number;
    condition: {
      text: string;
      icon: string;
    };
  };
}

interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
    localtime: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
    wind_kph: number;
  };
  forecast: {
    forecastday: Forecast[];
  };
}


const App: React.FC = () => {
  const [city, setCity] = useState<string>(''); 
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false); 
  const [error, setError] = useState<string | null>(null); 

  const fetchWeather = async (city: string) => {
    try {
      setLoading(true);
      setError(null);
      const apiKey = process.env.REACT_APP_SOME_KEY; 
      const response = await axios.get<WeatherData>(
        `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5&aqi=no`
      );
      setWeather(response.data);
    } catch (err) {
      setError('Error fetching weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather(city);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Weather App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">Get Weather</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {weather && (
        <div>
          <h3>Weather in {city}</h3>
          <p>Temperature: {weather.current.temp_c} °C</p>
          <p>Condition: {weather.current.condition.text}</p>
          <p>Wind speed: {weather.current.wind_kph} kph</p>
          <img src={weather.current.condition.icon} alt="weather icon" />

          <h3>5-Day Forecast</h3>
          <div>
            {weather.forecast.forecastday.map((day) => (
              <div key={day.date_epoch}>
                <h4>Date: {day.date}</h4>
                <p>Max Temp: {day.day.maxtemp_c} °C</p>
                <p>Min Temp: {day.day.mintemp_c} °C</p>
                <p>Condition: {day.day.condition.text}</p>
                <img src={day.day.condition.icon} alt="weather icon" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
