import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/:city", async (req, res) => {
  const city = req.params.city;
  const API_KEY = process.env.OPENWEATHER_API_KEY;

  try {
    if (!API_KEY) {
      return res.status(500).json({
        error: "Weather API key is not configured",
      });
    }

    const currentURL = "https://api.openweathermap.org/data/2.5/weather";
    const forecastURL = "https://api.openweathermap.org/data/2.5/forecast";

    const params = {
      q: city,
      appid: API_KEY,
      units: "metric",
    };

    const [currentResponse, forecastResponse] = await Promise.all([
      axios.get(currentURL, { params }),
      axios.get(forecastURL, { params }),
    ]);

    const currentData = currentResponse.data;
    const forecastData = forecastResponse.data;

    const dailyForecast = {};

    forecastData.list.forEach((item) => {
      const date = item.dt_txt.split(" ")[0];

      if (!dailyForecast[date]) {
        dailyForecast[date] = [];
      }

      dailyForecast[date].push(item);
    });

    const forecast = Object.entries(dailyForecast)
      .slice(0, 5)
      .map(([date, entries]) => {
        const midday = entries.reduce((closest, item) => {
          const hour = Number(item.dt_txt.split(" ")[1].slice(0, 2));
          const closestHour = Number(closest.dt_txt.split(" ")[1].slice(0, 2));

          return Math.abs(hour - 12) < Math.abs(closestHour - 12)
            ? item
            : closest;
        });

        return {
          date,
          temperature: midday.main.temp,
          minTemperature: Math.min(
            ...entries.map((item) => item.main.temp_min),
          ),
          maxTemperature: Math.max(
            ...entries.map((item) => item.main.temp_max),
          ),
          description: midday.weather[0].description,
          icon: midday.weather[0].icon,
        };
      });

    res.json({
      city: currentData.name,
      country: currentData.sys.country,

      current: {
        temperature: currentData.main.temp,
        feelsLike: currentData.main.feels_like,
        humidity: currentData.main.humidity,
        pressure: currentData.main.pressure,
        windSpeed: currentData.wind.speed * 3.6,
        description: currentData.weather[0].description,
        icon: currentData.weather[0].icon,
      },

      sunrise: currentData.sys.sunrise,
      sunset: currentData.sys.sunset,
      forecast,
    });
  } catch (error) {
    console.error("Weather API error:", error.response?.data || error.message);

    if (error.response?.status === 404) {
      return res.status(404).json({
        error: "City not found. Please check the city name.",
      });
    }

    if (error.response?.status === 401) {
      return res.status(401).json({
        error: "Invalid API key. Please check your OpenWeatherMap API key.",
      });
    }

    res.status(500).json({
      error: "Unable to fetch weather data. Please try again.",
    });
  }
});

export default router;
