import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";
import httpProxy from 'http-proxy';

const { createProxyServer } = httpProxy;

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

const proxy = httpProxy.createProxyServer();

// 处理所有请求
app.all('*', (req, res) => {
    // 将请求转发到 5001 端口
    proxy.web(req, res, { target: 'http://localhost:5001' });
});

server.listen(PORT, () => {
    console.log("server is running on PORT:" + PORT);
    connectDB();
});