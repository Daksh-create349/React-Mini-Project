/**
 * Generates contextual weather safety advisories from live weather data.
 * These are real-condition-based alerts, not made-up ones.
 */
export function generateConditionAlerts(weatherData) {
  if (!weatherData?.current || !weatherData?.location) return [];

  const { current, location, forecast } = weatherData;
  const now = new Date().toISOString();
  const alerts = [];

  const push = ({ event, headline, category, severity, msgType, desc, instruction }) => {
    alerts.push({
      event,
      headline,
      category,
      severity,
      msgType: msgType || 'Advisory',
      desc,
      instruction,
      effective: now,
      expires: null,
      locationName: location.name,
      country: location.country,
      isGenerated: true, // flag so we know it's computed
    });
  };

  // --- 1. HEAT ---
  const feelsLikeC = current.feelslike_c;
  const tempC = current.temp_c;
  if (feelsLikeC >= 41) {
    push({
      event: 'Extreme Heat Warning',
      headline: `Feels Like ${Math.round(feelsLikeC)}°C — Extreme Heat Danger in ${location.name}`,
      category: 'Heat',
      severity: 'Extreme',
      desc: `Current temperature is ${tempC}°C with a real-feel of ${feelsLikeC}°C. Extreme heat conditions are dangerous for all individuals.`,
      instruction: 'Stay indoors with air conditioning. Drink water every 15–20 minutes. Avoid outdoor physical activity. Check on elderly neighbors and pets.',
    });
  } else if (feelsLikeC >= 35) {
    push({
      event: 'Heat Advisory',
      headline: `Heat Advisory: Feels Like ${Math.round(feelsLikeC)}°C in ${location.name}`,
      category: 'Heat',
      severity: 'Moderate',
      desc: `Elevated heat conditions with a real-feel of ${feelsLikeC}°C. Heat illness risk is elevated for sensitive groups.`,
      instruction: 'Limit strenuous outdoor activity, especially during peak hours (11am–3pm). Stay hydrated and seek shade when outdoors.',
    });
  }

  // --- 2. WIND ---
  const windKph = current.wind_kph;
  const gustKph = current.gust_kph;
  if (windKph >= 90 || gustKph >= 100) {
    push({
      event: 'Extreme Wind Warning',
      headline: `Extreme Wind: ${Math.round(windKph)} km/h Gusting to ${Math.round(gustKph)} km/h`,
      category: 'Wind',
      severity: 'Extreme',
      desc: `Extremely dangerous wind conditions in ${location.name}. Sustained winds of ${windKph} km/h with gusts up to ${gustKph} km/h.`,
      instruction: 'Stay indoors. Do NOT drive. Secure or bring in all outdoor objects. Avoid trees and power lines. Power outages are possible.',
    });
  } else if (windKph >= 60 || gustKph >= 75) {
    push({
      event: 'High Wind Warning',
      headline: `High Wind Warning: Gusts up to ${Math.round(gustKph)} km/h in ${location.name}`,
      category: 'Wind',
      severity: 'Severe',
      desc: `Strong winds of ${windKph} km/h with gusts reaching ${gustKph} km/h. Travel is strongly discouraged.`,
      instruction: 'Secure outdoor furniture. Drive cautiously, especially in high-profile vehicles. Be alert for downed trees and power lines.',
    });
  } else if (windKph >= 40) {
    push({
      event: 'Wind Advisory',
      headline: `Wind Advisory: ${Math.round(windKph)} km/h Winds in ${location.name}`,
      category: 'Wind',
      severity: 'Moderate',
      desc: `Sustained winds of ${windKph} km/h may cause inconvenience and minor hazards.`,
      instruction: 'Secure lightweight outdoor items. Cyclists and motorcyclists should exercise additional caution.',
    });
  }

  // --- 3. RAIN / PRECIPITATION ---
  const todayForecast = forecast?.forecastday?.[0];
  const rainMm = todayForecast?.day?.totalprecip_mm || 0;
  const rainChance = todayForecast?.day?.daily_chance_of_rain || 0;
  const condText = current.condition?.text?.toLowerCase() || '';

  if (rainMm >= 50 || condText.includes('heavy rain') || condText.includes('torrential')) {
    push({
      event: 'Flash Flood Watch',
      headline: `Heavy Rainfall Alert: ${rainMm}mm Expected — Flash Flood Risk in ${location.name}`,
      category: 'Flood',
      severity: 'Severe',
      desc: `Heavy rainfall of ${rainMm}mm expected throughout the day. Flash flooding is possible in low-lying areas and near drainage channels.`,
      instruction: 'Avoid low-lying areas and flood-prone roads. Do not attempt to drive through floodwaters. Keep emergency supplies ready.',
    });
  } else if (rainMm >= 20 || condText.includes('rain')) {
    push({
      event: 'Rain Advisory',
      headline: `Rain Advisory: ${Math.round(rainChance)}% Chance of Rain in ${location.name}`,
      category: 'Rain',
      severity: 'Moderate',
      desc: `Wet conditions expected with ${rainMm}mm of rainfall forecasted today. Roads may become slippery.`,
      instruction: 'Carry an umbrella. Drive carefully and increase following distance. Watch for reduced visibility on highways.',
    });
  }

  // --- 4. THUNDERSTORM ---
  if (condText.includes('thunder') || condText.includes('storm')) {
    push({
      event: 'Thunderstorm Warning',
      headline: `Thunderstorm Warning Active for ${location.name}`,
      category: 'Thunderstorm',
      severity: 'Severe',
      desc: `Active thunderstorm conditions detected. Lightning, heavy rain, and gusty winds are occurring.`,
      instruction: 'Go indoors immediately. Unplug electronics. Stay away from windows and plumbing. Avoid open fields and tall isolated trees.',
    });
  }

  // --- 5. SNOW / FREEZING ---
  const snowCm = todayForecast?.day?.totalsnow_cm || 0;
  if (condText.includes('snow') || condText.includes('blizzard') || snowCm >= 5) {
    push({
      event: 'Winter Storm Advisory',
      headline: `Winter Storm: ${snowCm}cm Snow Expected in ${location.name}`,
      category: 'Winter Weather',
      severity: snowCm >= 15 ? 'Extreme' : 'Severe',
      desc: `Snowfall of ${snowCm}cm expected. Roads will become icy and travel conditions hazardous.`,
      instruction: 'Avoid non-essential travel. If driving, carry emergency supplies and use winter tires. Keep heating sources available.',
    });
  }

  if (condText.includes('freezing') || condText.includes('ice') || condText.includes('sleet')) {
    push({
      event: 'Ice/Freezing Rain Advisory',
      headline: `Freezing Rain Warning in ${location.name} — Icy Conditions Expected`,
      category: 'Winter Weather',
      severity: 'Severe',
      desc: `Freezing rain or ice is occurring or expected. This will cause extremely slippery road and walkway surfaces.`,
      instruction: 'Avoid all travel if possible. Walk with extreme care. Treat all surfaces as potentially icy.',
    });
  }

  // --- 6. UV INDEX ---
  const uv = current.uv;
  if (uv >= 11) {
    push({
      event: 'Extreme UV Index Alert',
      headline: `Extreme UV Index (${uv}) — High Skin Burn Risk in ${location.name}`,
      category: 'UV Radiation',
      severity: 'Extreme',
      desc: `The UV Index is ${uv}, classified as Extreme. Unprotected skin can burn in under 15 minutes.`,
      instruction: 'Wear SPF 50+ sunscreen, protective clothing, and sunglasses. Seek shade. Avoid sun exposure between 10am and 4pm.',
    });
  } else if (uv >= 8) {
    push({
      event: 'Very High UV Warning',
      headline: `Very High UV Index (${uv}) in ${location.name}`,
      category: 'UV Radiation',
      severity: 'Moderate',
      desc: `UV Index is ${uv} (Very High). Significant risk of harm from unprotected sun exposure.`,
      instruction: 'Apply sunscreen and reapply every 2 hours. Wear a hat and sunglasses when outdoors.',
    });
  }

  // --- 7. VISIBILITY ---
  const visKm = current.vis_km;
  if (visKm <= 0.5 || condText.includes('fog') || condText.includes('mist')) {
    push({
      event: 'Dense Fog Advisory',
      headline: `Dense Fog Advisory: Visibility ${visKm}km in ${location.name}`,
      category: 'Fog',
      severity: visKm <= 0.2 ? 'Severe' : 'Moderate',
      desc: `Dense fog is reducing visibility to ${visKm}km. Driving conditions are hazardous.`,
      instruction: 'Use low-beam headlights and fog lights. Reduce speed significantly. Increase following distance. Avoid highway travel if possible.',
    });
  }

  // --- 8. HUMIDITY ---
  const humidity = current.humidity;
  if (humidity >= 90 && tempC >= 30) {
    push({
      event: 'High Humidity & Heat Advisory',
      headline: `Oppressive Humidity (${humidity}%) Combined with ${tempC}°C Heat in ${location.name}`,
      category: 'Heat',
      severity: 'Moderate',
      desc: `Extremely high humidity of ${humidity}% combined with ${tempC}°C creates dangerous heat stress conditions. The human body cannot cool itself efficiently.`,
      instruction: 'Limit time outdoors. Wear breathable clothing. Stay hydrated. Watch for symptoms of heat exhaustion: dizziness, nausea, or heavy sweating.',
    });
  }

  // --- 9. AIR QUALITY ---
  const aqi = current.air_quality?.['us-epa-index'];
  if (aqi >= 5) {
    push({
      event: 'Very Unhealthy Air Quality',
      headline: `Air Quality Alert: AQI Level ${aqi} in ${location.name}`,
      category: 'Air Quality',
      severity: aqi >= 6 ? 'Extreme' : 'Severe',
      desc: `Air quality is at Level ${aqi} (${aqi >= 6 ? 'Hazardous' : 'Very Unhealthy'}). Everyone may experience serious health effects.`,
      instruction: 'Stay indoors and keep windows closed. Avoid all outdoor physical activity. Use air purifiers if available. Those with respiratory conditions should take extra precautions.',
    });
  } else if (aqi >= 3) {
    push({
      event: 'Air Quality Advisory',
      headline: `Elevated Pollution Levels (AQI ${aqi}) in ${location.name}`,
      category: 'Air Quality',
      severity: 'Moderate',
      desc: `Air quality is at Level ${aqi}. Sensitive groups including children, elderly, and those with respiratory conditions may be affected.`,
      instruction: 'Sensitive individuals should limit prolonged outdoor exertion. Keep inhalers or medication accessible.',
    });
  }

  // --- 10. COLD ---
  if (feelsLikeC <= -20) {
    push({
      event: 'Extreme Cold Warning',
      headline: `Extreme Cold: Feels Like ${Math.round(feelsLikeC)}°C — Frostbite Risk in ${location.name}`,
      category: 'Cold',
      severity: 'Extreme',
      desc: `Dangerously cold conditions with wind chill making it feel like ${feelsLikeC}°C. Frostbite can occur in minutes on exposed skin.`,
      instruction: 'Stay indoors. If you must go outside, cover ALL exposed skin. Watch for symptoms of hypothermia. Protect pipes from freezing.',
    });
  } else if (feelsLikeC <= -10) {
    push({
      event: 'Cold Weather Advisory',
      headline: `Cold Advisory: Feels Like ${Math.round(feelsLikeC)}°C in ${location.name}`,
      category: 'Cold',
      severity: 'Moderate',
      desc: `Cold conditions with wind chill creating a feel of ${feelsLikeC}°C. Risk of cold-related illness if exposed.`,
      instruction: 'Dress in warm layers. Limit time outdoors. Check on elderly neighbors and vulnerable individuals.',
    });
  }

  return alerts;
}
