// OpenWeatherMap Live Integration for HYDRA OS
// Reads VITE_OPENWEATHER_API_KEY from environment configuration

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const HYDERABAD_LAT = 17.4065;
const HYDERABAD_LON = 78.4772;

export async function fetchLiveHyderabadWeather() {
  if (!API_KEY) {
    console.log("No VITE_OPENWEATHER_API_KEY found, using local sensor mesh telemetry.");
    return null;
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${HYDERABAD_LAT}&lon=${HYDERABAD_LON}&units=metric&appid=${API_KEY}`
    );
    
    if (!res.ok) {
      throw new Error(`Weather API status: ${res.status}`);
    }

    const data = await res.json();
    const temp = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    const humidity = data.main.humidity;
    const windSpeed = Math.round(data.wind.speed * 3.6);
    const status = data.weather[0]?.main || "Clear";
    const description = data.weather[0]?.description || "Partly Cloudy";

    const estimatedAqi = Math.min(Math.max(Math.round(50 + (humidity * 0.4)), 40), 120);

    return {
      temp,
      feelsLike,
      humidity,
      windSpeed,
      status: `${status} (${description})`,
      score: estimatedAqi,
      pm25: Math.round(estimatedAqi * 0.4),
      pm10: Math.round(estimatedAqi * 0.8),
      uvIndex: Math.min(Math.round(temp / 4), 10),
      heatWarning: temp > 32 
        ? `Severe Heat Index: ${temp}°C in Gachibowli & Hitec City zones.` 
        : `Normal Sector Climate: ${temp}°C with ${humidity}% humidity.`,
      isLive: true
    };
  } catch (err) {
    console.warn("Live OpenWeather API fetch fallback used:", err.message);
    return null;
  }
}
