import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT;

const allowedOrigins = process.env.NODE_ENV === "development"
  ? "http://localhost:5173"
  : "https://cchat.chat";

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize()); // 初始化 Passport
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.use('/api/auth/*', (req, res) => {
  console.log("Invalid auth route accessed:", req.originalUrl);
  res.status(404).json({ message: "Route not found" });
});

server.listen(PORT, () => {
  console.log("Server is running on PORT:" + PORT);
  connectDB();
});