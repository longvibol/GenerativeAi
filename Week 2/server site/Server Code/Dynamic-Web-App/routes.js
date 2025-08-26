// routes.js
const express = require("express");
const router = express.Router();

// --- Helper: ID generator ---
const makeId = () => {
  try {
    return crypto.randomUUID();
  } catch {
    return String(Date.now()) + Math.random().toString(16).slice(2);
  }
};

// --- In-memory data for our simple API ---
const quotes = [
  {
    id: "q1",
    text: "Be yourself; everyone else is already taken.",
    author: "Oscar Wilde",
  },
  {
    id: "q2",
    text: "Simplicity is the soul of efficiency.",
    author: "Austin Freeman",
  },
  {
    id: "q3",
    text: "Code is like humor. When you have to explain it, it’s bad.",
    author: "Cory House",
  },
];

// Mock user data
const users = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "admin" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", role: "editor" },
  {
    id: 3,
    name: "Charlie Brown",
    email: "charlie@example.com",
    role: "viewer",
  },
];

// --- Routes ---
router.get("/", (req, res) => {
  res.send("Hello from the server!");
});

router.get("/datetime", (req, res) => {
  const now = new Date();
  const formatted = now.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });
  res.send(`Current date and time: ${formatted}`);
});

// --- Users API ---
router.get("/api/users", (req, res) => {
  res.json(users);
});

router.get("/api/users/:id", (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const user = users.find((u) => u.id === userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

// --- Greet ---
router.get("/greet", (req, res) => {
  const name = (req.query.name || "there").toString();
  res.send(`Hello, ${name}!`);
});

router.get("/greet/:name", (req, res) => {
  const { name } = req.params;
  res.send(`Hello, ${name}!`);
});

// --- Quotes API ---
router.get("/api/quotes", (req, res) => {
  res.json(quotes);
});

router.get("/api/quotes/random", (req, res) => {
  const pick = quotes[Math.floor(Math.random() * quotes.length)];
  res.json(pick);
});

router.get("/api/quotes/:id", (req, res) => {
  const found = quotes.find((q) => q.id === req.params.id);
  if (!found) return res.status(404).json({ error: "Quote not found" });
  res.json(found);
});

router.post("/api/quotes", (req, res) => {
  const { text, author } = req.body || {};
  if (!text || !author) {
    return res
      .status(400)
      .json({ error: "Both 'text' and 'author' are required" });
  }
  const newQuote = { id: makeId(), text, author };
  quotes.push(newQuote);
  res.status(201).json(newQuote);
});

router.delete("/api/quotes/:id", (req, res) => {
  const idx = quotes.findIndex((q) => q.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Quote not found" });
  const [removed] = quotes.splice(idx, 1);
  res.json({ removed });
});

// --- Health + 404 ---
router.get("/api/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime(), timestamp: Date.now() });
});

router.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

module.exports = router;
