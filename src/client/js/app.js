// API URLs
const GEONAMES_URL = "http://api.geonames.org/searchJSON"
const WEATHERBIT_URL = "https://api.weatherbit.io/v2.0/forecast/daily"
const PIXABAY_URL = "https://pixabay.com/api/"

// API Keys (replace with your actual keys or environment variables)
const GEONAMES_USERNAME = "your_geonames_username" // Replace with your Geonames username
const WEATHERBIT_API_KEY = "your_weatherbit_api_key" // Replace with your Weatherbit API key
const PIXABAY_API_KEY = "your_pixabay_api_key" // Replace with your Pixabay API key

// Primary object to store trip data
const tripData = {
  city: "",
  country: "",
  departureDate: "",
  returnDate: "",
  daysUntilTrip: 0,
  tripDuration: 0,
  weather: {},
  image: "",
}

// Primary function
export async function handleSubmit(event) {
  event.preventDefault()

  // Get input values
  const city = document.getElementById("city").value
  const departureDate = document.getElementById("departure").value
  const returnDate = document.getElementById("return").value

  // Validate input
  if (!city || !departureDate || !returnDate) {
    alert("Please fill in all fields")
    return
  }

  try {
    // Get location data
    const geoData = await getGeoData(city)
    tripData.city = geoData.name
    tripData.country = geoData.countryName

    // Get weather data
    const weatherData = await getWeatherData(geoData.lat, geoData.lng, departureDate)
    tripData.weather = weatherData

    // Get image URL
    const imageUrl = await getImageUrl(city)
    tripData.image = imageUrl

    // Calculate trip details
    tripData.departureDate = departureDate
    tripData.returnDate = returnDate
    tripData.daysUntilTrip = calculateDaysUntil(departureDate)
    tripData.tripDuration = calculateTripDuration(departureDate, returnDate)

    // Update UI
    updateUI()
  } catch (error) {
    console.error("Error:", error)
    alert("An error occurred. Please try again.")
  }
}

export function calculateDaysUntil(date) {
  const today = new Date()
  const tripDate = new Date(date)
  today.setHours(0, 0, 0, 0)
  tripDate.setHours(0, 0, 0, 0)
  const timeDiff = tripDate.getTime() - today.getTime()
  return Math.ceil(timeDiff / (1000 * 3600 * 24))
}

export function calculateTripDuration(startDate, endDate) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const timeDiff = end.getTime() - start.getTime()
  return Math.ceil(timeDiff / (1000 * 3600 * 24))
}

async function getGeoData(city) {
  const response = await fetch(`${GEONAMES_URL}?q=${city}&maxRows=1&username=${GEONAMES_USERNAME}`)
  const data = await response.json()
  return data.geonames[0]
}

async function getWeatherData(lat, lon, date) {
  const response = await fetch(`${WEATHERBIT_URL}?lat=${lat}&lon=${lon}&key=${WEATHERBIT_API_KEY}`)
  const data = await response.json()
  return data.data[0]
}

async function getImageUrl(city) {
  const response = await fetch(`${PIXABAY_URL}?key=${PIXABAY_API_KEY}&q=${city}&image_type=photo`)
  const data = await response.json()
  return data.hits[0].webformatURL
}

function updateUI() {
  document.getElementById("results").innerHTML = `
        <h2>Your Trip to ${tripData.city}, ${tripData.country}</h2>
        <p>Departing: ${tripData.departureDate}</p>
        <p>Returning: ${tripData.returnDate}</p>
        <p>Trip duration: ${tripData.tripDuration} days</p>
        <p>Days until trip: ${tripData.daysUntilTrip}</p>
        <p>Weather forecast: ${tripData.weather.temp}°C, ${tripData.weather.weather.description}</p>
        <img src="${tripData.image}" alt="${tripData.city}" />
    `
}

export { getGeoData, getWeatherData, getImageUrl }

