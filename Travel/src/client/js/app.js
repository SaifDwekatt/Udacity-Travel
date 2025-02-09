const geonamesUrl = 'http://api.geonames.org/searchJSON?q=';
const weatherbitUrl = 'https://api.weatherbit.io/v2.0/forecast/daily?';
const pixabayUrl = 'https://pixabay.com/api/?';

const fetchGeonames = async (location) => {
  try {
    const response = await fetch(`${geonamesUrl}${location}&maxRows=1&username=YOUR_USERNAME`);
    const data = await response.json();
    
    if (!data.geonames || data.geonames.length === 0) {
      throw new Error("Location not found in GeoNames API.");
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching GeoNames:', error);
    return null;
  }
};

const fetchWeather = async (lat, lon) => {
  try {
    const response = await fetch(`${weatherbitUrl}lat=${lat}&lon=${lon}&key=YOUR_API_KEY`);
    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      throw new Error("Weather data not available.");
    }

    return data;
  } catch (error) {
    console.error('Error fetching Weather:', error);
    return null;
  }
};

const fetchImage = async (query) => {
  try {
    const response = await fetch(`${pixabayUrl}key=YOUR_API_KEY&q=${query}&image_type=photo`);
    const data = await response.json();

    if (!data.hits || data.hits.length === 0) {
      throw new Error("No image found for this location.");
    }

    return data;
  } catch (error) {
    console.error('Error fetching Image:', error);
    return null;
  }
};

const handleSubmit = async () => {
  const location = document.getElementById('location').value;

  if (!location) {
    alert("Please enter a location.");
    return;
  }

  const geoData = await fetchGeonames(location);
  if (!geoData) {
    alert("Location not found. Please try again.");
    return;
  }

  const { lat, lng } = geoData.geonames[0];

  const weatherData = await fetchWeather(lat, lng);
  if (!weatherData) {
    alert("Weather data not available.");
    return;
  }

  const imageData = await fetchImage(location);
  if (!imageData) {
    alert("No image available for this location.");
  }

  document.getElementById('results').innerHTML = `
    <p>Weather: ${weatherData.data[0]?.temp || 'N/A'}°C</p>
    ${imageData ? `<img src="${imageData.hits[0]?.webformatURL}" alt="${location}">` : "<p>No image available.</p>"}
  `;
};

export { handleSubmit };
