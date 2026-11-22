# 🌤️ Live Weather Telemetry App

A responsive, real-time weather application that allows users to search for cities worldwide and view current weather conditions along with a 5-day forecast.

The application uses the OpenWeatherMap API to retrieve live weather data and features dynamic backgrounds, weather icons, and animated loading indicators.

## 🚀 Live Demo

- **Frontend:** [View Live Application](https://weatherforecast-adn.netlify.app/)
- **Backend:** Deployed on Render

## ✨ Features

- **Global City Search** – Search for weather information in cities around the world.
- **Real-Time Weather Data** – View current temperature and weather conditions.
- **Weather Details** – Displays humidity, wind speed, atmospheric pressure, and feels-like temperature.
- **5-Day Forecast** – View upcoming weather conditions with temperature details.
- **Dynamic Weather Backgrounds** – Background themes change according to weather conditions, including sunny, cloudy, rainy, snowy, and night.
- **Weather Icons** – Displays dynamic icons based on current weather conditions.
- **Animated Loading Indicator** – Provides visual feedback while fetching weather data.
- **Error Handling** – Displays helpful messages for invalid cities and API errors.
- **Responsive Design** – Works across desktop and mobile devices.
- **Automatic Footer Year** – Updates the copyright year automatically.

## 🛠️ Tech Stack

**Frontend**
- HTML5
- CSS3
- JavaScript

**Backend**
- Node.js
- Express.js
- Axios
- Node-Cache

**API**
- OpenWeatherMap API

**Deployment**
- Netlify – Frontend
- Render – Backend

## 📁 Project Structure

```text
Real time Weather Forecast/
│
├── .gitignore
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── config.js
│
└── server/
    ├── server.js
    ├── package.json
    ├── package-lock.json
    ├── .env
    │
    └── routes/
        └── weather.js
```

## ⚙️ Local Installation and Setup

### 1. Get an API Key

- Visit [OpenWeatherMap](https://openweathermap.org/api).
- Create an account.
- Generate an API key.

### 2. Configure the Backend

Navigate to the server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the server directory:

```env
OPENWEATHER_API_KEY=your_api_key_here
```

### 3. Start the Backend

Run:

```bash
npm start
```

The backend will run at:

```text
http://localhost:3000
```

### 4. Start the Frontend

- Open the `frontend` folder in VS Code.
- Launch `index.html` using Live Server or another local development server.
- Search for a city to retrieve weather information.

The frontend configuration automatically selects the local backend during local development and the deployed Render backend in production.

## 🌐 Deployment

The application uses separate hosting services for the frontend and backend.

| Component | Platform |
|---|---|
| Frontend | Netlify |
| Backend | Render |
| Weather Data | OpenWeatherMap |

The OpenWeatherMap API key is stored securely as an environment variable on Render rather than being exposed in the frontend.

## 📸 Application Highlights

- Real-time weather information.
- Dynamic weather-based themes.
- Animated loading indicator.
- Five-day weather forecast.
- Responsive user interface.

## 👨‍💻 Author

**Adarsha Naskar**

B.Tech Computer Science and Engineering

[GitHub](https://github.com/AdarshaNaskar)

---

⭐ If you find this project interesting, feel free to explore it!
