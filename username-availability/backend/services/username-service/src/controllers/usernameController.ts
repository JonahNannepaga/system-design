import { Request, Response } from "express";
import { BloomFilter } from "../services/bloomFilter";
import { RedisService } from "../services/redisService";
import { DbService } from "../services/dbService";
import { SuggestionService } from "../services/suggestionService";

export class UsernameController {
  private bloomFilterService: BloomFilter;
  private redisService: RedisService;
  private dbService: DbService;
  private suggestionService: SuggestionService;

  constructor(
    bloomFilterService: BloomFilter,
    redisService: RedisService,
    dbService: DbService,
    suggestionService: SuggestionService
  ) {
    this.bloomFilterService = bloomFilterService;
    this.redisService = redisService;
    this.dbService = dbService;
    this.suggestionService = suggestionService;
  }

  public async checkUsername(req: Request, res: Response): Promise<void> {
    try {
      const { username } = req.params;

      // Check bloom filter first (fast negative)
      const mightExist = this.bloomFilterService.contains(username);
      if (!mightExist) {
        res.json({ exists: false, available: true });
        return;
      }

      // Check Redis cache
      const existsInRedis = await this.redisService.check(username);
      if (existsInRedis) {
        res.json({ exists: true, available: false });
        return;
      }

      // Final check in database
      const existsInDb = await this.dbService.check(username);
      res.json({ exists: existsInDb, available: !existsInDb });
    } catch (error) {
      console.error("Error checking username:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  public async registerUsername(req: Request, res: Response): Promise<void> {
    try {
      const { username, userId } = req.body;

      // Check if username already exists
      const exists = await this.dbService.check(username);
      if (exists) {
        res.status(400).json({ error: "Username already exists" });
        return;
      }

      // Register in database
      await this.dbService.register(username, userId);

      // Add to cache and bloom filter
      await this.redisService.register(username);
      this.bloomFilterService.add(username);

      res
        .status(201)
        .json({ success: true, message: "Username registered successfully" });
    } catch (error) {
      console.error("Error registering username:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  public async suggestUsernames(req: Request, res: Response): Promise<void> {
    try {
      const { username } = req.params;
      const suggestions = await this.suggestionService.suggest(username);
      res.json({ suggestions });
    } catch (error) {
      console.error("Error suggesting usernames:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
