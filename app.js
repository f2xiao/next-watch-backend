require("dotenv").config();
const express = require("express");
const app = express();
require("express-async-errors");
const cors = require("cors");
const watchRoutes = require("./routes/watch");
const userRoutes = require("./routes/user");
const nextwatchRoutes = require("./routes/nextwatch");

const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

logger.info("connecting to", url);
mongoose
  .connect(url)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

// app.use(cors());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/nextwatches", nextwatchRoutes);
app.use("/api/watches", watchRoutes);
app.use("/api/users", userRoutes);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
