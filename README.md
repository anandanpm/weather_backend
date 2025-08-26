# 🌤️ Weather API Backend

A robust Node.js/Express REST API for weather data management with intelligent caching, database integration, and real-time weather fetching from WeatherAPI.com.

## 🚀 Features

- **Real-time Weather Data** - Fetch current weather from WeatherAPI.com
- **Smart Caching** - 30-minute cache to reduce API calls and improve performance
- **Database Storage** - MongoDB integration with Mongoose ODM
- **Search Functionality** - Search previously fetched weather data
- **CORS Support** - Configured for frontend integration
- **Error Handling** - Comprehensive error handling and validation
- **TypeScript** - Full TypeScript support for type safety

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **HTTP Client**: Axios
- **Environment**: dotenv
- **CORS**: cors middleware

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v16 or higher)
- **MongoDB** database (local or MongoDB Atlas)
- **WeatherAPI.com** API key ([Get free key here](https://www.weatherapi.com/))
- **npm** or **yarn** package manager

## ⚡ Quick Start

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd weather-backend
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/weather-db
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/weather-db

# API Configuration
WEATHER_API_KEY=your_weatherapi_key_here
PORT=5000

# Frontend Configuration
FRONTEND_URL=http://localhost:5173
NODE_ENV=development

# Production Frontend (when deployed)
# FRONTEND_URL=https://your-frontend-domain.com
# NODE_ENV=production
```

### 4. Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
Local: http://localhost:5000/api/weather
Production: https://your-backend-domain.com/api/weather
```

### Endpoints

#### 🌍 Get Current Weather
```http
GET /api/weather?city={cityName}
```

**Description**: Fetches current weather data for a specified city. Returns cached data if available (within 30 minutes), otherwise fetches fresh data from WeatherAPI.

**Parameters**:
- `city` (string, required) - City name to get weather for

**Response Example**:
```json
{
  "_id": "64f8a1b2c3d4e5f6g7h8i9j0",
  "searchcity": "mumbai",
  "city": "Mumbai",
  "temperature": 28.5,
  "condition": "Partly cloudy",
  "date": "2024-08-26T10:30:00.000Z",
  "__v": 0
}
```

**Status Codes**:
- `200` - Success
- `400` - Missing city parameter
- `404` - City not found
- `500` - Server error

---

#### 📋 Get All Weather Records
```http
GET /api/weather/all
```

**Description**: Retrieves all stored weather data, sorted by most recent first.

**Response Example**:
```json
[
  {
    "_id": "64f8a1b2c3d4e5f6g7h8i9j0",
    "searchcity": "mumbai",
    "city": "Mumbai",
    "temperature": 28.5,
    "condition": "Partly cloudy",
    "date": "2024-08-26T10:30:00.000Z"
  },
  {
    "_id": "64f8a1b2c3d4e5f6g7h8i9j1",
    "searchcity": "london",
    "city": "London",
    "temperature": 18.2,
    "condition": "Light rain",
    "date": "2024-08-26T09:15:00.000Z"
  }
]
```

---

#### 🔍 Search Weather in Database
```http
GET /api/weather/search?city={searchTerm}
```

**Description**: Searches for weather data in the database using partial city name matching.

**Parameters**:
- `city` (string, required) - Search term for city name

**Response Example**:
```json
[
  {
    "_id": "64f8a1b2c3d4e5f6g7h8i9j0",
    "searchcity": "mumbai",
    "city": "Mumbai",
    "temperature": 28.5,
    "condition": "Partly cloudy",
    "date": "2024-08-26T10:30:00.000Z"
  }
]
```

**Status Codes**:
- `200` - Success (even if no results)
- `400` - Missing search parameter
- `404` - No data found
- `500` - Server error

## 🗃️ Database Schema

### Weather Model
```typescript
{
  searchcity: String,    // Lowercase city name for searching
  city: String,          // Formatted city name from API
  temperature: Number,   // Temperature in Celsius
  condition: String,     // Weather condition description
  date: Date            // Timestamp of data fetch
}
```

### Indexes (Recommended)
```javascript
// Add these indexes for better performance
db.weathers.createIndex({ "searchcity": 1 })
db.weathers.createIndex({ "date": -1 })
db.weathers.createIndex({ "searchcity": 1, "date": -1 })
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `WEATHER_API_KEY` | WeatherAPI.com API key | Yes | - |
| `PORT` | Server port | No | 5000 |
| `FRONTEND_URL` | Frontend URL for CORS | Yes | - |


### CORS Configuration

The API is configured to accept requests from:
- Development: `http://localhost:5173`
- Production: Value from `FRONTEND_URL` environment variable

## 🚀 Deployment

### Render.com Deployment

1. **Connect your repository** to Render
2. **Set environment variables** in Render dashboard:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   WEATHER_API_KEY=your_weatherapi_key
   FRONTEND_URL=https://your-frontend-domain.com
   NODE_ENV=production
   ```
3. **Deploy** - Render will automatically build and deploy


### Testing with Postman

Import these requests into Postman:

1. **GET Current Weather**
   - URL: `{{baseUrl}}/api/weather?city=mumbai`
   - Method: GET

2. **GET All Weather**
   - URL: `{{baseUrl}}/api/weather/all`
   - Method: GET

3. **GET Search Weather**
   - URL: `{{baseUrl}}/api/weather/search?city=london`
   - Method: GET

## 📊 Performance Features

- **Smart Caching**: 30-minute cache reduces API calls by ~90%
- **Database Indexing**: Optimized queries for fast search
- **Error Fallbacks**: Graceful degradation when external API fails
- **Request Logging**: Monitor API usage and performance

## 🔒 Security Features

- **Environment Variables**: Sensitive data stored securely
- **CORS Protection**: Controlled access from specified origins
- **Input Validation**: Request parameter validation
- **Error Handling**: No sensitive data exposed in error messages

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   ```
   Solution: Check MONGODB_URI and ensure MongoDB is running
   ```

2. **WeatherAPI Key Invalid**
   ```
   Solution: Verify WEATHER_API_KEY in .env file
   ```

3. **CORS Error**
   ```
   Solution: Check FRONTEND_URL matches your frontend domain
   ```

4. **Port Already in Use**
   ```bash
   # Kill process on port 5000
   lsof -ti:5000 | xargs kill -9
   ```

### Debug Mode

Enable detailed logging:
```javascript
// Add to app.ts
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Query:', req.query);
  next();
});
```
