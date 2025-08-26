"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchWeatherInDB = exports.getAllWeather = exports.getWeather = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const weather_1 = __importDefault(require("../models/weather"));
dotenv_1.default.config();
const getWeather = async (req, res) => {
    try {
        const { city } = req.query;
        if (!city) {
            return res.status(400).json({ message: "City is required" });
        }
        const apiKey = process.env.WEATHER_API_KEY;
        if (!apiKey) {
            throw new Error("API key is missing");
        }
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        const existing = await weather_1.default.findOne({
            searchcity: city.toLowerCase(),
            date: { $gte: thirtyMinutesAgo }
        });
        if (existing) {
            return res.json(existing);
        }
        // Fetch new data from WeatherAPI
        const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
        const response = await axios_1.default.get(url);
        console.log("API Response:", response.data);
        // Handle WeatherAPI error BEFORE saving to DB
        if (response.data.error) {
            return res.status(404).json({ message: response.data.error.message });
        }
        // Save valid weather data
        const data = {
            searchcity: city.toLowerCase(),
            city: response.data.location.name,
            temperature: response.data.current.temp_c,
            condition: response.data.current.condition.text,
            date: new Date()
        };
        const weather = new weather_1.default(data);
        await weather.save();
        console.log("New weather data saved:", data);
        res.json(weather);
    }
    catch (error) {
        console.error("Unexpected error:", error.response?.data || error.message);
        // If it's an Axios error with response, forward the message
        if (error.response?.data?.error?.message) {
            return res.status(error.response.status || 400).json({ message: error.response.data.error.message });
        }
        // Otherwise, generic server error
        res.status(500).json({ message: "Error fetching weather", error: error.message });
    }
};
exports.getWeather = getWeather;
const getAllWeather = async (_req, res) => {
    try {
        const weathers = await weather_1.default.find().sort({ date: -1 });
        res.json(weathers);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching stored weather", error: error.message });
    }
};
exports.getAllWeather = getAllWeather;
const searchWeatherInDB = async (req, res) => {
    try {
        const { city } = req.query;
        if (!city) {
            return res.status(400).json({ message: "City is required" });
        }
        const results = await weather_1.default.find({
            searchcity: { $regex: new RegExp(city, "i") }
        }).sort({ date: -1 });
        console.log(results, 'the search results');
        if (!results.length) {
            return res.status(404).json({ message: "No data found in DB for this city" });
        }
        res.json(results);
    }
    catch (error) {
        res.status(500).json({ message: "Error searching weather", error: error.message });
    }
};
exports.searchWeatherInDB = searchWeatherInDB;
