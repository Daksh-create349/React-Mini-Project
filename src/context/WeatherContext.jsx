import React, { createContext, useState, useContext, useEffect } from 'react';
import { weatherApi } from '../services/weatherApi';
import { useLocalStorage } from '../hooks/useLocalStorage';

const WeatherContext = createContext();

export const useWeather = () => useContext(WeatherContext);

export const WeatherProvider = ({ children }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [recentSearches, setRecentSearches] = useLocalStorage('weatherHistory', []);
  const [favorites, setFavorites] = useLocalStorage('weatherFavorites', []);
  const [isDarkMode, setIsDarkMode] = useLocalStorage('weatherDarkMode', true);

  const fetchWeather = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const [data, historyData] = await Promise.all([
        weatherApi.getWeather(query),
        weatherApi.getHistory(query)
      ]);
      setWeatherData({ ...data, history: historyData });
      
      // Store rich history item
      const locationId = `${data.location.name}-${data.location.country}`;
      const historyItem = {
        id: locationId,
        query: `${data.location.name}, ${data.location.country}`,
        name: data.location.name,
        country: data.location.country,
        region: data.location.region,
        temp_c: data.current.temp_c,
        conditionText: data.current.condition.text,
        icon: data.current.condition.icon,
        timestamp: new Date().toISOString()
      };

      setRecentSearches(prev => {
        const filtered = prev.filter(item => item.id !== locationId);
        return [historyItem, ...filtered].slice(0, 10); // Keep last 10
      });
      
    } catch (err) {
      setError(err?.response?.data?.error?.message || "Failed to fetch weather data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = () => {
    if (!weatherData) return;
    
    const locationId = `${weatherData.location.name}-${weatherData.location.country}`;
    
    setFavorites(prev => {
      const isFav = prev.some(item => item.id === locationId);
      if (isFav) {
        return prev.filter(item => item.id !== locationId);
      } else {
        const favItem = {
          id: locationId,
          query: `${weatherData.location.name}, ${weatherData.location.country}`,
          name: weatherData.location.name,
          country: weatherData.location.country,
          region: weatherData.location.region,
          temp_c: weatherData.current.temp_c,
          conditionText: weatherData.current.condition.text,
          icon: weatherData.current.condition.icon,
          addedAt: new Date().toISOString()
        };
        return [...prev, favItem];
      }
    });
  };

  const removeFavorite = (locationId) => {
    setFavorites(prev => prev.filter(item => item.id !== locationId));
  };
  
  const removeHistoryItem = (locationId) => {
    setRecentSearches(prev => prev.filter(item => item.id !== locationId));
  };

  const isCurrentFavorite = weatherData 
    ? favorites.some(item => item.id === `${weatherData.location.name}-${weatherData.location.country}`)
    : false;

  const value = {
    weatherData,
    loading,
    error,
    recentSearches,
    favorites,
    fetchWeather,
    toggleFavorite,
    removeFavorite,
    removeHistoryItem,
    isCurrentFavorite,
    clearRecentSearches: () => setRecentSearches([]),
    isDarkMode,
    toggleDarkMode: () => setIsDarkMode(prev => !prev)
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
};
