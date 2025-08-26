"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const WeatherSchema = new mongoose_1.default.Schema({
    searchcity: { type: String, required: true },
    city: { type: String, required: true },
    temperature: { type: Number, required: true },
    condition: { type: String, required: true },
    date: { type: Date, default: Date.now }
});
exports.default = mongoose_1.default.model("Weather", WeatherSchema);
