# FEND Capstone - Travel App

## Overview
This Travel App is a capstone project for the Udacity Front End Web Developer Nanodegree. It allows users to plan trips by entering their destination and travel dates, then provides weather forecasts and images of their destination.

## Features
- Enter destination city and travel dates
- View weather forecast for the destination
- See images of the destination
- Calculate trip duration and days until departure
- Responsive design for all device sizes
- Offline functionality with service workers

## Technologies Used
- **Frontend**: HTML5, SCSS, JavaScript (ES6+)
- **Backend**: Node.js, Express
- **Build Tool**: Webpack (with separate dev and prod configurations)
- **Testing**: Jest for unit and integration tests, Cypress for end-to-end testing
- **CI/CD**: GitHub Actions workflow for continuous integration
- **APIs**: Geonames, Weatherbit, Pixabay

## API Integrations
This project integrates with three external APIs:
1. **Geonames API**: For geographical data and coordinates
2. **Weatherbit API**: For weather forecasts based on location and date
3. **Pixabay API**: For destination images

## Installation and Setup

### Prerequisites
- Node.js (v14.0.0 or higher)
- npm (comes with Node.js)
- API keys for Geonames, Weatherbit, and Pixabay

### Steps
1. Clone the repository:
