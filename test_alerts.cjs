const axios = require('axios');
const API_KEY = 'c2b442fc94a9407d94180112260805'; // User's key
const CITIES = ['Houston', 'Miami', 'Chicago', 'Denver', 'Seattle', 'London', 'Paris', 'Toronto'];

async function checkAlerts() {
  for (const city of CITIES) {
    try {
      const res = await axios.get(`http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&alerts=yes`);
      const alerts = res.data.alerts?.alert || [];
      console.log(`${city}: ${alerts.length} alerts`);
    } catch (e) {
      console.log(`${city}: Error`);
    }
  }
}
checkAlerts();
