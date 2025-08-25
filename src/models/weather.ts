import mongoose, { Document } from "mongoose";

export interface WeatherDoc extends Document {
  city: string;
  temperature: number;
  condition: string;
  date: Date;
}

const WeatherSchema = new mongoose.Schema<WeatherDoc>({
  city: { type: String, required: true },
  temperature: { type: Number, required: true },
  condition: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.model<WeatherDoc>("Weather", WeatherSchema);
