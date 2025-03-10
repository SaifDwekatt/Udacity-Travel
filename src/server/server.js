import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import dotenv from "dotenv"
import fetch from "node-fetch"

dotenv.config()

const app = express()

// Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.use(express.static("dist"))

// API keys
const GEONAMES_USERNAME = process.env.GEONAMES_USERNAME
const WEATHERBIT_API_KEY = process.env.WEATHERBIT_API_KEY
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY

// Geonames API endpoint
app.get("/geo", async (req, res) => {
  try {
    const { city } = req.query
    const response = await fetch(
      `http://api.geonames.org/searchJSON?q=${encodeURIComponent(city)}&maxRows=1&username=${GEONAMES_USERNAME}`,
    )
    const data = await response.json()

    if (data.geonames && data.geonames.length > 0) {
      res.json({
        success: true,
        ...data.geonames[0],
      })
    } else {
      res.json({
        success: false,
        error: "City not found",
      })
    }
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
    })
  }
})

// Weatherbit API endpoint
app.get("/weather", async (req, res) => {
  try {
    const { lat, lon, date } = req.query
    const response = await fetch(
      `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${WEATHERBIT_API_KEY}`,
    )
    const data = await response.json()

    if (data.data) {
      res.json({
        success: true,
        data: data.data[0],
      })
    } else {
      res.json({
        success: false,
        error: "Weather data not found",
      })
    }
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
    })
  }
})

// Pixabay API endpoint
app.get("/image", async (req, res) => {
  try {
    const { city } = req.query
    const response = await fetch(
      `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(city)}+city&image_type=photo`,
    )
    const data = await response.json()

    if (data.hits && data.hits.length > 0) {
      res.json({
        success: true,
        url: data.hits[0].webformatURL,
      })
    } else {
      res.json({
        success: false,
        error: "No image found",
      })
    }
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
    })
  }
})

// Setup Server
const port = process.env.PORT || 3000
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => console.log(`Server running on port ${port}`))
}

export default app

