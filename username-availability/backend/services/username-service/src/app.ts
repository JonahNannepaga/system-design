import express from "express";
import { json } from "express";
import cors from "cors";
import { UsernameController } from "./controllers/usernameController";
import { BloomFilter } from "./services/bloomFilter";
import { RedisService } from "./services/redisService";
import { DbService } from "./services/dbService";
import { SuggestionService } from "./services/suggestionService";

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(json());

// Initialize services
const bloomFilter = new BloomFilter(1000000, 7); // 1M capacity, 7 hash functions
const redisService = new RedisService();
const dbService = new DbService();
const suggestionService = new SuggestionService();

// Controllers
const usernameController = new UsernameController(
  bloomFilter,
  redisService,
  dbService,
  suggestionService
);

// Routes
app.get(
  "/check/:username",
  usernameController.checkUsername.bind(usernameController)
);
app.post(
  "/register",
  usernameController.registerUsername.bind(usernameController)
);
app.get(
  "/suggest/:username",
  usernameController.suggestUsernames.bind(usernameController)
);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "UP", service: "username-service" });
});

// Start the server
app.listen(port, () => {
  console.log(`Username Service is running on http://localhost:${port}`);
});
