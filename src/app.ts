import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import weatherRoutes from "./routes/weatherRoutes";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use("/weather", weatherRoutes);

export default app;
