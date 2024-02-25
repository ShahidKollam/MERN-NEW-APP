import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO);
    console.log(`MongoDB Connected Succesfully`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

connectDB();

const app = express();
app.use(express.json());

app.listen(4000, () => {
  console.log(`Server running on http://localhost:4000/`);
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Errot";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});
