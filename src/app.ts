import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import cors from "cors";
import weatherRoutes from "./routes/weatherRoutes";

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use("/weather", weatherRoutes);

export default app;
