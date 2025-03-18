import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes";
import groupRoutes from "./routes/groupRoutes";
import authRoutes from "./routes/auth.routes";
import contributionRoutes from "./routes/contributionRoutes";

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.ALLOWED_ORIGINS?.split(",")
      : [
          "http://localhost:5173",
          "http://localhost:8080",
          "http://127.0.0.1:5173",
          "http://127.0.0.1:8080",
        ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
};
app.use(cors(corsOptions));

// Helmet configuration
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  })
);

app.use(morgan("dev"));

// Rate limiting
const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/contributions", contributionRoutes);

// Error handling middleware
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Error:", err);

    // Ensure response hasn't been sent yet
    if (res.headersSent) {
      return _next(err);
    }

    // Handle validation errors
    if (err.name === "ValidationError") {
      return res.status(400).json({
        status: "error",
        message: err.message,
        errors: err.errors,
      });
    }

    // Handle token errors
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "error",
        message: "Invalid or expired token",
      });
    }

    // Handle mongoose errors
    if (err.name === "CastError") {
      return res.status(400).json({
        status: "error",
        message: "Invalid data format",
      });
    }

    // Handle duplicate key errors
    if (err.code === 11000) {
      return res.status(409).json({
        status: "error",
        message: "Duplicate entry",
      });
    }

    // Default error response
    return res.status(500).json({
      status: "error",
      message: err.message || "An unexpected error occurred",
    });
  }
);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
