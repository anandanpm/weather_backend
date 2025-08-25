import express from "express";
import { getWeather, getAllWeather, searchWeatherInDB } from "../controllers/weatherController";

const router = express.Router();

router.get("/", getWeather);


router.get("/all", getAllWeather);

router.get("/search", searchWeatherInDB);

export default router;
