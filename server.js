const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./src/config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/news", require("./src/routes/newsRoutes"));
app.use("/api/users", require("./src/routes/userRoutes"));
app.use("/api/contact", require("./src/routes/contactRoutes"));

app.get("/", (req, res) => {
  res.json({ message: "News Portal API is running..." });

  // MUST BE AT THE VERY BOTTOM OF server.js
  app.use((err, req, res, next) => {
    // <--- Ensure 'next' is here even if unused
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
  });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
