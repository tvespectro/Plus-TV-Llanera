import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("llanera_tv.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
  );

  CREATE TABLE IF NOT EXISTS wishlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    movie_id INTEGER,
    title TEXT,
    poster_path TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    movie_id INTEGER,
    rating INTEGER,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Movie API Proxy
  app.get("/api/movies/trending", async (req, res) => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.TMDB_API_KEY}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch movies" });
    }
  });

  app.get("/api/movies/search", async (req, res) => {
    const { query } = req.query;
    try {
      const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${query}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Search failed" });
    }
  });

  app.get("/api/movies/:id", async (req, res) => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${req.params.id}?api_key=${process.env.TMDB_API_KEY}&append_to_response=videos,credits,recommendations`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch movie details" });
    }
  });

  // Wishlist API
  app.get("/api/wishlist/:userId", (req, res) => {
    const items = db.prepare("SELECT * FROM wishlist WHERE user_id = ?").all(req.params.userId);
    res.json(items);
  });

  app.post("/api/wishlist", (req, res) => {
    const { userId, movieId, title, posterPath } = req.body;
    const stmt = db.prepare("INSERT INTO wishlist (user_id, movie_id, title, poster_path) VALUES (?, ?, ?, ?)");
    stmt.run(userId, movieId, title, posterPath);
    res.json({ success: true });
  });

  app.delete("/api/wishlist/:userId/:movieId", (req, res) => {
    const stmt = db.prepare("DELETE FROM wishlist WHERE user_id = ? AND movie_id = ?");
    stmt.run(req.params.userId, req.params.movieId);
    res.json({ success: true });
  });

  // Reviews API
  app.get("/api/reviews/:movieId", (req, res) => {
    const reviews = db.prepare("SELECT * FROM reviews WHERE movie_id = ? ORDER BY created_at DESC").all(req.params.movieId);
    res.json(reviews);
  });

  app.post("/api/reviews", (req, res) => {
    const { userId, movieId, rating, comment } = req.body;
    const stmt = db.prepare("INSERT INTO reviews (user_id, movie_id, rating, comment) VALUES (?, ?, ?, ?)");
    stmt.run(userId, movieId, rating, comment);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
