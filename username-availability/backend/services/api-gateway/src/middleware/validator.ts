import { Request, Response, NextFunction } from "express";

export const validateUsername = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username } = req.body;

  // Check if username is provided
  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  // Check username length
  if (username.length < 3 || username.length > 30) {
    return res
      .status(400)
      .json({ error: "Username must be between 3 and 30 characters" });
  }

  // Check for invalid characters (only alphanumeric and underscores)
  const validUsernamePattern = /^[a-zA-Z0-9_]+$/;
  if (!validUsernamePattern.test(username)) {
    return res
      .status(400)
      .json({
        error: "Username can only contain letters, numbers, and underscores",
      });
  }

  next();
};

export default validateUsername;
