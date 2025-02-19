import express from "express"
import path from "path"
import { fileURLToPath } from "url"
import fetch from "node-fetch"
import dotenv from "dotenv"

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = process.env.PORT || 3000

// Middleware
app.use(express.static("dist"))
app.use(express.json())

// API keys
const WEATHERBIT_API_KEY = process.env.WEATHERBIT_API_KEY
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY

// Mock fetch for testing
const mockFetch = (url) => {
  if (url.includes("weatherbit")) {
    return Promise.resolve({
      json: () => Promise.resolve({ data: [{ temp: 25, weather: { description: "Sunny" } }] }),
    })
  } else if (url.includes("pixabay")) {
    return Promise.resolve({
      json: () => Promise.resolve({ hits: [{ webformatURL: "https://example.com/image.jpg" }] }),
    })
  }
  return Promise.reject(new Error("Not found"))
}

// Use mock fetch in test environment
const fetchToUse = process.env.NODE_ENV === "test" ? mockFetch : fetch

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.resolve("dist/index.html"))
})

app.get("/test", (req, res) => {
  res.json({ message: "Test route working" })
})

// Weather API route
app.get("/weather", async (req, res) => {
  const { lat, lon } = req.query
  try {
    const response = await fetchToUse(
      `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${WEATHERBIT_API_KEY}`,
    )
    const data = await response.json()
    if (data.error) {
      throw new Error(data.error)
    }
    res.json(data)
  } catch (error) {
    console.error("Error fetching weather data:", error)
    res.status(500).json({ error: error.message || "Failed to fetch weather data" })
  }
})

// Image API route
app.get("/image", async (req, res) => {
  const { city } = req.query
  try {
    const response = await fetchToUse(
      `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(city)}+city&image_type=photo`,
    )
    const data = await response.json()
    if (data.error) {
      throw new Error(data.error)
    }
    res.json(data)
  } catch (error) {
    console.error("Error fetching image data:", error)
    res.status(500).json({ error: error.message || "Failed to fetch image data" })
  }
})

// Start server
let server
if (process.env.NODE_ENV !== "test") {
  server = app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
}

export { app, server }

