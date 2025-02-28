//helperFunctions.js
const apiKey = {
  geonamesUsername: "your_geonames_username",
  weatherbitApiKey: process.env.WEATHERBIT_API_KEY,
  pixabayApiKey: process.env.PIXABAY_API_KEY,
}

const geonamesBaseUrl = "http://api.geonames.org/searchJSON?q="
const weatherbitBaseUrl = "https://api.weatherbit.io/v2.0/forecast/daily?"
const pixabayBaseUrl = "https://pixabay.com/api/?"

export const getGeoData = async (city) => {
  const response = await fetch(`${geonamesBaseUrl}${city}&maxRows=1&username=${apiKey.geonamesUsername}`)
  const data = await response.json()
  return data.geonames[0]
}

export const getWeatherData = async (lat, lon, date) => {
  const response = await fetch(
    `${weatherbitBaseUrl}lat=${lat}&lon=${lon}&key=${apiKey.weatherbitApiKey}&days=1&date=${date}`,
  )
  const data = await response.json()
  return data.data[0]
}

export const getImageUrl = async (city) => {
  const response = await fetch(`${pixabayBaseUrl}key=${apiKey.pixabayApiKey}&q=${city}&image_type=photo&per_page=1`)
  const data = await response.json()
  return data.hits[0].webformatURL
}

export const calculateDaysUntil = (dateString) => {
  const futureDate = new Date(dateString)
  const today = new Date()
  const diffTime = Math.abs(futureDate - today)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

export const calculateTripDuration = (startDateString, endDateString) => {
  const startDate = new Date(startDateString)
  const endDate = new Date(endDateString)
  const diffTime = Math.abs(endDate - startDate)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays - 1
}

export const updateUI = (tripData) => {
  document.getElementById("results").innerHTML = `
        <h2>Your Trip to ${tripData.city}, ${tripData.country}</h2>
        <p>Departure Date: ${tripData.departureDate}</p>
        <p>Return Date: ${tripData.returnDate}</p>
        <p>Days Until Trip: ${tripData.daysUntilTrip}</p>
        <p>Trip Duration: ${tripData.tripDuration} days</p>
        <h3>Weather forecast:</h3>
        <p>${tripData.weather.weather.description} - ${tripData.weather.temp}°C</p>
        <img src="${tripData.imageUrl}" alt="Image of ${tripData.city}">
    `
}

