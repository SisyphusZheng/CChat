import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import https from "https";
import http from "http";
import fs from "fs";
import path from "path";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";
import httpProxy from 'http-proxy';

const { createProxyServer } = httpProxy;
dotenv.config();

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

let sslOptions;
try {
  sslOptions = {
    key: fs.readFileSync('/etc/ssl/cchat.chat/cchat.chat.key'),
    cert: fs.readFileSync('/etc/ssl/cchat.chat/fullchain.crt')
  };
} catch (error) {
  console.error('SSL 证书加载失败:', error.message);
  process.exit(1);
}

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.NODE_ENV === "production"
      ? "https://cchat.chat"
      : "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  const staticPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(staticPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });
}

const proxy = createProxyServer({
  target: 'http://localhost:5001',
  ws: true,
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    proxyReqOpts.headers['X-Forwarded-For'] = srcReq.ip;
    return proxyReqOpts;
  }
});

proxy.on('error', (err, req, res) => {
  console.error('代理请求失败:', err);
  res.status(500).json({ error: '代理服务异常' });
});

app.all('*', (req, res) => {
  proxy.web(req, res);
});

const httpsServer = https.createServer(sslOptions, app);
const httpServer = http.createServer((req, res) => {
  res.writeHead(301, {
    "Location": `https://${req.headers.host}${req.url}`
  });
  res.end();
});

httpsServer.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head);
});

httpsServer.listen(443, () => {
  console.log("HTTPS server running on port 443");
  connectDB();
});

httpServer.listen(80, () => {
  console.log("HTTP redirect server running on port 80");
});

server.listen(httpsServer);