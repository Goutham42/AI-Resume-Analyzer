const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
const app = express();

// ---------- MIDDLEWARE ----------
app.use(express.json());

// ---------- CORS ----------
// ---------- CORS ----------

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL, // make sure this matches your live frontend
  "https://ai-resume-analyzer-en9rpc1gg-gouthams-projects-6b3f110f.vercel.app" // Add exact Vercel URL
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow Postman / curl
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `CORS error: origin ${origin} not allowed`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"]
}));

// ---------- ROUTES ----------
app.use("/auth", require("./routes/authRoutes"));
app.use("/resume", require("./routes/resumeRoutes"));
app.use(express.json({ limit: "2mb" }));


// ---------- DATABASE ----------
connectDB();

// ---------- TEST ROUTE ----------
app.get("/ping", (req, res) => res.send("pong"));

// ---------- ERROR HANDLER ----------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// ---------- START SERVER ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
