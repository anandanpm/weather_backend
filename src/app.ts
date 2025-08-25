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
    origin: "http://localhost:5173", 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(express.json());

app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    next();
});

app.use("/weather", weatherRoutes);

export default app;
