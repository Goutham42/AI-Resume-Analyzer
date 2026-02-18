const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
const app = express();

// ---------- MIDDLEWARE ----------
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// ---------- CORS ----------
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // Postman / curl

    // Allow localhost, your main frontend URL, or any *.vercel.app
    const allowedHosts = [
      "http://localhost:5173",
      process.env.CLIENT_URL
    ];

    try {
      const url = new URL(origin);
      if (allowedHosts.includes(origin) || url.hostname.endsWith(".vercel.app")) {
        return callback(null, true);
      }
    } catch (err) {
      return callback(new Error(`CORS error: invalid origin ${origin}`), false);
    }

    return callback(new Error(`CORS error: origin ${origin} not allowed`), false);
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
