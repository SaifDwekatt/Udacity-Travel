// API URLs and keys
const GEONAMES_URL = "http://api.geonames.org/searchJSON"
const WEATHERBIT_URL = "https://api.weatherbit.io/v2.0/forecast/daily"
const PIXABAY_URL = "https://pixabay.com/api/"
const GEONAMES_USERNAME = process.env.GEONAMES_USERNAME
const WEATHERBIT_API_KEY = process.env.WEATHERBIT_API_KEY
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY

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

/**
 * Primary function to handle form submission
 * This function orchestrates the entire process of gathering trip information,
 * fetching relevant data from APIs, and updating the UI
 * @param {Event} event - The submit event from the form
 */
export async function handleSubmit(event) {
  event.preventDefault()

  // Get input values from the form
  const city = document.getElementById("city").value
  const departureDate = document.getElementById("departure").value
  const returnDate = document.getElementById("return").value

  // Validate input to ensure all fields are filled
  if (!city || !departureDate || !returnDate) {
    alert("Please fill in all fields")
    return
  }

  try {
    // Fetch and process data from various APIs
    await fetchTripData(city, departureDate, returnDate)

    // Update the UI with the fetched data
    updateUI()
  } catch (error) {
    console.error("Error:", error)
    alert("An error occurred. Please try again.")
  }
}

/**
 * Fetches all necessary data for the trip
 * This includes geographical data, weather forecast, and a representative image
 * @param {string} city - The destination city
 * @param {string} departureDate - The departure date
 * @param {string} returnDate - The return date
 */
async function fetchTripData(city, departureDate, returnDate) {
  // Get location data
  const geoData = await getGeoData(city)
  tripData.city = geoData.name
  tripData.country = geoData.countryName

  // Get weather data
  const weatherData = await getWeatherData(geoData.lat, geoData.lng, departureDate)
  tripData.weather = weatherData

  // Get image
  const imageUrl = await getImageUrl(city)
  tripData.image = imageUrl

  // Calculate trip details
  tripData.departureDate = departureDate
  tripData.returnDate = returnDate
  tripData.daysUntilTrip = calculateDaysUntil(departureDate)
  tripData.tripDuration = calculateTripDuration(departureDate, returnDate)
}

/**
 * Fetches geographical data for a given city using the Geonames API
 * @param {string} city - The name of the city
 * @returns {Object} - An object containing geographical data
 */
async function getGeoData(city) {
  const response = await fetch(`${GEONAMES_URL}?q=${city}&maxRows=1&username=${GEONAMES_USERNAME}`)
  const data = await response.json()
  if (data.geonames.length === 0) {
    throw new Error("City not found")
  }
  return data.geonames[0]
}

/**
 * Fetches weather forecast data for a given location and date using the Weatherbit API
 * @param {number} lat - Latitude of the location
 * @param {number} lon - Longitude of the location
 * @param {string} date - The date for which to fetch the forecast
 * @returns {Object} - An object containing weather forecast data
 */
async function getWeatherData(lat, lon, date) {
  const response = await fetch(`${WEATHERBIT_URL}?lat=${lat}&lon=${lon}&key=${WEATHERBIT_API_KEY}`)
  const data = await response.json()
  const forecastDate = new Date(date)
  const forecast = data.data.find((day) => new Date(day.datetime).getTime() === forecastDate.getTime())
  return forecast || data.data[0] // Return first day if exact date not found
}

/**
 * Fetches an image URL for a given city using the Pixabay API
 * @param {string} city - The name of the city
 * @returns {string} - URL of an image representing the city
 */
async function getImageUrl(city) {
  const response = await fetch(`${PIXABAY_URL}?key=${PIXABAY_API_KEY}&q=${city}+city&image_type=photo`)
  const data = await response.json()
  return data.hits.length > 0 ? data.hits[0].webformatURL : ""
}

/**
 * Calculates the number of days until a given date
 * @param {string} date - The future date
 * @returns {number} - Number of days until the given date
 */
function calculateDaysUntil(date) {
  const today = new Date()
  const tripDate = new Date(date)
  const timeDiff = tripDate.getTime() - today.getTime()
  return Math.ceil(timeDiff / (1000 * 3600 * 24))
}

/**
 * Calculates the duration of a trip in days
 * @param {string} startDate - The start date of the trip
 * @param {string} endDate - The end date of the trip
 * @returns {number} - Duration of the trip in days
 */
function calculateTripDuration(startDate, endDate) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const timeDiff = end.getTime() - start.getTime()
  return Math.ceil(timeDiff / (1000 * 3600 * 24))
}

/**
 * Updates the UI with the trip data
 * This function populates the results section of the page with
 * the fetched and calculated trip information
 */
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

// Export for testing
export { calculateDaysUntil, calculateTripDuration, getGeoData, getWeatherData, getImageUrl }

