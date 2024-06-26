import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import adminRoutes from "./routes/admin.route.js"
import cookieParser from "cookie-parser";
import path from "path";
      
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

const __dirname = path.resolve()

const app = express();

app.use(express.static(path.join(__dirname, "/client/dist")))

app.get("*", (req,res) => {
  res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"))
})

app.use(express.json());
app.use(cookieParser())

app.listen(4000, () => {
  console.log(`Server running on http://localhost:4000/`);
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/auth/admin", adminRoutes)

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});
