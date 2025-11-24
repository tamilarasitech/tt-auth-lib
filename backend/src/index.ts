import { onRequest } from "firebase-functions/v2/https";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import "./config/firebase";

dotenv.config();

const app = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Import routes
import authRoutes from "./routes/auth.routes";

// API routes
app.use("/api/auth", authRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

exports.api = onRequest(
  {
    timeoutSeconds: 60,
    memory: "1GiB",
    region: "asia-south1",
    cors: true,
  },
  app
);
