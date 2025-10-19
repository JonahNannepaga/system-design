import { Router, Request, Response } from "express";

const router: Router = Router();

// Health check route
router.get("/", (req: Request, res: Response) => {
  res.status(200).json({ status: "UP", service: "api-gateway" });
});

export default router;
