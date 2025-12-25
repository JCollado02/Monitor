# Monitor

A real-time sensor monitoring system built with ESP32 microcontrollers, DHT22 sensors, and a custom web dashboard. This project demonstrates full-stack IoT development from embedded systems to cloud deployment, designed to monitor environmental conditions in my 3D printing workspace and other locations.

## Features

- **Hardware Integration**: ESP32 boards with DHT22 sensors collect temperature and humidity readings
- **Power Optimization**: Implemented battery sensing and power management for extended deployment
- **Smart Hub-Style Dashboard**: React-based web interface mimicking modern smart device hubs and SCADA systems
- **Custom API**: RESTful backend built with Spring Boot and Java for sensor data management
- **Cloud Architecture**: PostgreSQL database on Supabase with separate frontend/backend deployment

## Tech Stack

- **Hardware**: ESP32, DHT22 sensors
- **Backend**: Spring Boot, PostgreSQL
- **Frontend**: React, JavaScript
- **Deployment**: Render (backend), Supabase (database), Netlify (frontend)

## How It Works

DHT22 sensors capture temperature and humidity data and transmit readings to an ESP32 microcontroller. The ESP32 sends data via POST requests to the Spring Boot backend, which stores readings in a PostgreSQL database hosted on Supabase. The React frontend retrieves data through GET requests and visualizes real-time metrics on a web dashboard.

## Setup Instructions

**Live Demo**: https://monitoros.netlify.app/

**Local Development**:
1. Clone the repository
2. Backend: `cd backend && ./mvnw spring-boot:run`
3. Frontend: `cd frontend && npm install && npm start`
4. Configure environment variables for database connection

## Future Improvements

- Enhanced battery optimization for longer deployment cycles
- Gas sensor integration for filament fume detection (safety monitoring for ABS/Nylon printing)
- Dark mode UI theme
- Interactive chart controls with historical data analysis
