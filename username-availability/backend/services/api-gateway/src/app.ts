import express, { Request, Response } from "express";
import { json } from "body-parser";
import cors from "cors";
import healthRoutes from "./routes/health";
import usernameRoutes from "./routes/username";
import rateLimiter from "./middleware/rateLimiter";
import validateUsername from "./middleware/validator";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(json());
app.use(rateLimiter);

// Root route for testing
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "API Gateway is running",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/health", healthRoutes);
app.use("/username", validateUsername, usernameRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`API Gateway is running on http://localhost:${PORT}`);
});
