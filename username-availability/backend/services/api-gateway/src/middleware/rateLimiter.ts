import { Request, Response, NextFunction } from "express";

const RATE_LIMIT = 100; // Max requests per window
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

const rateLimitMap: Map<string, { count: number; startTime: number }> =
  new Map();

export const rateLimiter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ip = req.ip || req.connection.remoteAddress || "unknown";

  const currentTime = Date.now();
  const rateLimitData = rateLimitMap.get(ip) || {
    count: 0,
    startTime: currentTime,
  };

  if (currentTime - rateLimitData.startTime > WINDOW_MS) {
    // Reset the rate limit
    rateLimitData.count = 1;
    rateLimitData.startTime = currentTime;
  } else {
    rateLimitData.count += 1;
  }

  rateLimitMap.set(ip, rateLimitData);

  if (rateLimitData.count > RATE_LIMIT) {
    return res
      .status(429)
      .json({ message: "Too many requests, please try again later." });
  }

  next();
};

export default rateLimiter;
