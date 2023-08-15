const express = require("express");
const multer = require('multer');
const AudioController = require("../controllers/audio");

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post("/save", upload.single('audio'), AudioController.saveAudio);
router.post("/chatgpt", AudioController.summarizeTranscript)

module.exports = router;
    