"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const weatherController_1 = require("../controllers/weatherController");
const router = express_1.default.Router();
router.get("/", weatherController_1.getWeather);
router.get("/all", weatherController_1.getAllWeather);
router.get("/search", weatherController_1.searchWeatherInDB);
exports.default = router;
