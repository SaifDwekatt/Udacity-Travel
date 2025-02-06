const geonamesUrl = 'http://api.geonames.org/searchJSON?q=';
const weatherbitUrl = 'https://api.weatherbit.io/v2.0/forecast/daily?';
const pixabayUrl = 'https://pixabay.com/api/?';

const fetchGeonames = async (location) => {
  const response = await fetch(`${geonamesUrl}${location}&maxRows=1&username=YOUR_USERNAME`);
  try {
    return await response.json();
  } catch (error) {
    console.log('Error fetching :', error);
  }
};

const fetchWeather = async (lat, lon) => {
  const response = await fetch(`${weatherbitUrl}lat=${lat}&lon=${lon}&key=YOUR_API_KEY`);
  try {
    return await response.json();
  } catch (error) {
    console.log('Error fetching:', error);
  }
};

const fetchImage = async (query) => {
  const response = await fetch(`${pixabayUrl}key=YOUR_API_KEY&q=${query}&image_type=photo`);
  try {
    return await response.json();
  } catch (error) {
    console.log('Error fetching :', error);
  }
};

const handleSubmit = async () => {
  const location = document.getElementById('location').value;
  const geoData = await fetchGeonames(location);
  const { lat, lng } = geoData.geonames[0];
  const weatherData = await fetchWeather(lat, lng);
  const imageData = await fetchImage(location);
  
  document.getElementById('results').innerHTML = `
    <p>Weather: ${weatherData.data[0].temp}°C</p>
    <img src="${imageData.hits[0].webformatURL}" alt="${location}">
  `;
};

export { handleSubmit };
