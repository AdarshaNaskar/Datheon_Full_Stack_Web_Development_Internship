const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("city");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const feelsLike = document.getElementById("feelslike");
const pressure = document.getElementById("pressure");

const forecastContainer = document.getElementById("forecastContainer");
const weatherIcon = document.querySelector(".weather-icon");
const loadingIndicator = document.getElementById("loadingIndicator");
const errorMessage = document.getElementById("errorMessage");

async function getWeather(city) {
  try {
    // Show loading animation
    loadingIndicator.hidden = false;
    errorMessage.hidden = true;

    // Keep it visible briefly so the animation can be seen
    await new Promise((resolve) => setTimeout(resolve, 800));

    const response = await fetch(
      `${API_BASE_URL}/api/weather/${encodeURIComponent(city)}`,
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to fetch weather data");
    }

    // Display city information
    cityName.textContent = `${data.city}, ${data.country}`;

    // Display current weather
    temperature.textContent = Math.round(data.current.temperature);
    humidity.textContent = data.current.humidity + "%";
    wind.textContent = Math.round(data.current.windSpeed) + " km/h";
    feelsLike.textContent = Math.round(data.current.feelsLike) + "°C";
    pressure.textContent = Math.round(data.current.pressure) + " hPa";

    description.textContent = data.current.description;

    // Update background based on weather condition
    const weatherCondition = data.current.description.toLowerCase();
    const weatherIconCode = data.current.icon;

    document.body.className = "";

    if (weatherIconCode === "01n") {
      document.body.classList.add("night");
    } else if (
      weatherCondition.includes("rain") ||
      weatherCondition.includes("drizzle") ||
      weatherCondition.includes("thunderstorm")
    ) {
      document.body.classList.add("rainy");
    } else if (weatherCondition.includes("snow")) {
      document.body.classList.add("snowy");
    } else if (
      weatherCondition.includes("cloud") ||
      weatherCondition.includes("mist") ||
      weatherCondition.includes("fog") ||
      weatherCondition.includes("haze")
    ) {
      document.body.classList.add("cloudy");
    } else {
      document.body.classList.add("sunny");
    }

    // Update duplicate weather details
    document.getElementById("feelslike-copy").textContent =
      Math.round(data.current.feelsLike) + "°C";

    document.getElementById("pressure-copy").textContent =
      Math.round(data.current.pressure) + " hPa";

    // Display current weather icon
    weatherIcon.innerHTML = `
      <img
        src="https://openweathermap.org/img/wn/${data.current.icon}@2x.png"
        alt="${data.current.description}"
      >
    `;

    // Display 5-day forecast
    displayForecast(data.forecast);
  } catch (error) {
    console.error(error);

    errorMessage.textContent = error.message;
    errorMessage.hidden = false;
  } finally {
    // Hide loading animation
    loadingIndicator.hidden = true;
  }
}

function displayForecast(forecast) {
  forecastContainer.innerHTML = "";

  forecast.forEach((day, index) => {
    const date = new Date(day.date + "T12:00:00");

    const formattedDate = date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

    const forecastCard = document.createElement("div");
    forecastCard.classList.add("forecast-card");

    forecastCard.innerHTML = `
      <p>${formattedDate}</p>

      <img
        class="forecast-icon"
        src="https://openweathermap.org/img/wn/${day.icon}@2x.png"
        alt="${day.description}"
      >

      <strong>${Math.round(day.temperature)}°C</strong>

      <span class="forecast-condition">
        ${day.description}
      </span>
    `;

    forecastContainer.appendChild(forecastCard);
  });
}

// Search button
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();

  if (city === "") {
    alert("Please enter a city name");
    return;
  }

  getWeather(city);
});

// Search using Enter key
cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchBtn.click();
  }
});

// Automatically update footer year
document.getElementById("currentYear").textContent = new Date().getFullYear();
