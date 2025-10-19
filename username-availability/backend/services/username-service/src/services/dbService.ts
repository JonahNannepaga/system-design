import { Pool } from "pg";

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "username_db",
  password: process.env.DB_PASSWORD || "password",
  port: Number(process.env.DB_PORT) || 5432,
});

export class DbService {
  async check(username: string): Promise<boolean> {
    try {
      const result = await pool.query(
        "SELECT COUNT(*) FROM usernames WHERE username = $1",
        [username]
      );
      return parseInt(result.rows[0].count) > 0;
    } catch (error) {
      console.error("Database check error:", error);
      return false;
    }
  }

  async register(username: string, userId?: number): Promise<void> {
    try {
      await pool.query(
        "INSERT INTO usernames (username, user_id) VALUES ($1, $2)",
        [username, userId || Math.floor(Math.random() * 1000000)]
      );
    } catch (error) {
      console.error("Database register error:", error);
      throw error;
    }
  }

  async getAllUsernames(): Promise<any[]> {
    try {
      const result = await pool.query("SELECT * FROM usernames");
      return result.rows;
    } catch (error) {
      console.error("Database getAllUsernames error:", error);
      return [];
    }
  }

  async closeConnection(): Promise<void> {
    await pool.end();
  }
}
