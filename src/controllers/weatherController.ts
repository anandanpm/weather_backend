import { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
import Weather from "../models/weather";
dotenv.config();




export const getWeather = async (req: Request, res: Response) => {
  try {
    const { city } = req.query;
    console.log("City received:", city);
    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }

    const apiKey = process.env.WEATHER_API_KEY;
    if (!apiKey) {
      throw new Error("API key is missing");
    }

    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const existing = await Weather.findOne({
      searchcity: (city as string).toLowerCase(),
      date: { $gte: thirtyMinutesAgo }
    });

    if (existing) {
      return res.json(existing);
    }

    // Fetch new data from WeatherAPI
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
    console.log("Fetching URL:", url);

    const response = await axios.get(url);
    console.log("API Response:", response.data);

    // Handle WeatherAPI error BEFORE saving to DB
    if (response.data.error) {
      console.log("WeatherAPI returned error:", response.data.error.message);
      return res.status(404).json({ message: response.data.error.message });
    }

    // Save valid weather data
    const data = {
      searchcity: (city as string).toLowerCase(),
      city: response.data.location.name,
      temperature: response.data.current.temp_c,
      condition: response.data.current.condition.text,
      date: new Date()
    };

    const weather = new Weather(data);
    await weather.save();
    console.log("New weather data saved:", data);

    res.json(weather);
  } catch (error: any) {
    console.error("Unexpected error:", error.response?.data || error.message);

    // If it's an Axios error with response, forward the message
    if (error.response?.data?.error?.message) {
      return res.status(error.response.status || 400).json({ message: error.response.data.error.message });
    }

    // Otherwise, generic server error
    res.status(500).json({ message: "Error fetching weather", error: error.message });
  }
};




export const getAllWeather = async (_req: Request, res: Response) => {
  try {
    const weathers = await Weather.find().sort({ date: -1 });
    res.json(weathers);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching stored weather", error: error.message });
  }
};


export const searchWeatherInDB = async (req: Request, res: Response) => {
  try {
    const { city } = req.query;
    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }

    const results = await Weather.find({
      searchcity: { $regex: new RegExp(city as string, "i") }
    }).sort({ date: -1 });

    console.log(results,'the search results');

    if (!results.length) {
      return res.status(404).json({ message: "No data found in DB for this city" });
    }

    res.json(results);
  } catch (error: any) {
    res.status(500).json({ message: "Error searching weather", error: error.message });
  }
};
