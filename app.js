const config = require("./utils/config");
const express = require("express");
const app = express();
require('express-async-errors');
const cors = require("cors");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");

const watchRoutes = require("./routes/watch");
const userRoutes = require("./routes/user");

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/watches", watchRoutes);
app.use("/api/users", userRoutes);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
