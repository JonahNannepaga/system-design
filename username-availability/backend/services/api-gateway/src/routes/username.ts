import express, { Router } from "express";
import {
  checkUsername,
  registerUsername,
  suggestUsernames,
} from "../services/usernameService";

const router: Router = express.Router();

// Check if a username exists
router.get("/check/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const exists = await checkUsername(username);
    res.json({ available: !exists });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Register a new username
router.post("/register", async (req, res) => {
  const { username, userId } = req.body;
  if (!username || !userId) {
    return res.status(400).json({ error: "Username and userId are required" });
  }

  try {
    const success = await registerUsername(username, userId);
    if (success) {
      res.status(201).json({ message: "Username registered successfully" });
    } else {
      res.status(400).json({ error: "Username registration failed" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Suggest alternative usernames
router.get("/suggest/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const suggestions = await suggestUsernames(username);
    res.json({ suggestions });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
