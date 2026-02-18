const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
const app = express();

// ---------- MIDDLEWARE ----------
app.use(express.json({ limit: "2mb" })); // set size limit for JSON
app.use(express.urlencoded({ extended: true }));

// ---------- CORS ----------
const allowedOrigins = [
  "http://localhost:5173", // local dev
  process.env.CLIENT_URL,  // live frontend from .env
  "https://ai-resume-analyzer-5r8n7rkat-gouthams-projects-6b3f110f.vercel.app" // exact Vercel URL
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow Postman / curl requests
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error(`CORS error: origin ${origin} not allowed`), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

// ---------- ROUTES ----------
app.use("/auth", require("./routes/authRoutes"));
app.use("/resume", require("./routes/resumeRoutes"));

// ---------- DATABASE ----------
connectDB();

// ---------- TEST ROUTE ----------
app.get("/ping", (req, res) => res.send("pong"));

// ---------- ERROR HANDLER ----------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Something went wrong!" });
});

// ---------- START SERVER ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
