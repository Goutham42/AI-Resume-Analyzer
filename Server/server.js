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
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.CLIENT_URL
    ],
    credentials: true,
  })
);




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
