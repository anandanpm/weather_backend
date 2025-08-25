import { Request, Response } from "express";
import axios from "axios";
import Weather from "../models/weather";

const apiKey = process.env.WEATHER_API_KEY ; 

export const getWeather = async (req: Request, res: Response) => {
  try {
    const { city } = req.query;
    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }

    
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const existing = await Weather.findOne({
      city: { $regex: new RegExp(`^${city}$`, "i") }, 
      date: { $gte: thirtyMinutesAgo }
    });

    if (existing) {
      return res.json(existing); 
    }

    // fetch new data from WeatherAPI
    const response = await axios.get(
      `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`
    );

    const data = {
      city: response.data.location.name,
      temperature: response.data.current.temp_c,
      condition: response.data.current.condition.text,
      date: new Date()
    };

    const weather = new Weather(data);
    await weather.save();

    res.json(weather);
  } catch (error: any) {
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
      city: { $regex: new RegExp(city as string, "i") }
    }).sort({ date: -1 });

    if (!results.length) {
      return res.status(404).json({ message: "No data found in DB for this city" });
    }

    res.json(results);
  } catch (error: any) {
    res.status(500).json({ message: "Error searching weather", error: error.message });
  }
};
