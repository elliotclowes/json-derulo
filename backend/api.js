const express = require("express");
const cors = require("cors");
const logger = require("morgan")

const userRoutes = require("./routers/userRoutes");
const tokenRoutes = require("./routers/tokenRoutes");
const audioRoutes = require("./routers/audioRoutes");
const videoRoutes = require("./routers/videoRoutes");

// t
const api = express();

api.use(cors());
api.use(express.json());
api.use(logger('dev'))

api.use("/user", userRoutes);
api.use("/token", tokenRoutes);
api.use("/audio", audioRoutes)
api.use("/video", videoRoutes)

api.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

module.exports = api;
