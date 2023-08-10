const express = require("express");
const VideoController = require("../controllers/video");

const router = express.Router();

router.post("/fetch_subtitles", VideoController);

module.exports = router;
