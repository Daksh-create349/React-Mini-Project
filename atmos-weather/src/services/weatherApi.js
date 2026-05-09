import axios from 'axios';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.weatherapi.com/v1';

const apiClient = axios.create({
  baseURL: BASE_URL,
});

export const weatherApi = {
  // Fetch autocomplete suggestions
  searchLocations: async (query) => {
    if (!query) return [];
    try {
      const response = await apiClient.get('/search.json', {
        params: { key: API_KEY, q: query },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching locations:", error.response?.data || error.message);
      throw error;
    }
  },

  // Fetch full weather data (current + forecast + aqi)
  getWeather: async (query) => {
    try {
      const response = await apiClient.get('/forecast.json', {
        params: { 
          key: API_KEY, 
          q: query, 
          days: 7, 
          aqi: 'yes', 
          alerts: 'yes' 
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching weather:", error.response?.data || error.message);
      throw error;
    }
  },

  // Fetch historical weather for the past 7 days
  getHistory: async (query) => {
    try {
      const today = new Date();
      const promises = [];
      // WeatherAPI history endpoint requires one date per request for the free tier usually,
      // or allows multiple days if on a higher tier. Free tier history is limited.
      // Let's fetch the last 3 days to avoid rate limits on the free tier.
      for (let i = 1; i <= 3; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dt = d.toISOString().split('T')[0];
        promises.push(
          apiClient.get('/history.json', {
            params: { key: API_KEY, q: query, dt }
          }).catch(() => null) // Ignore errors for individual days (e.g., plan limits)
        );
      }
      const results = await Promise.all(promises);
      // Filter out failed requests and extract forecastday array
      return results
        .filter(res => res && res.data && res.data.forecast)
        .map(res => res.data.forecast.forecastday[0]);
    } catch (error) {
      console.error("Error fetching history:", error);
      return [];
    }
  }
};
