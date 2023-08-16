const express = require("express");
const multer = require('multer');
const AudioUPController = require("../controllers/audioup");
const AudioController = require("../controllers/audio");

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post("/save", upload.single('audio'), AudioController.saveAudio);
router.post("/chatgpt", AudioController.summarizeTranscript)
router.post("/shorten", AudioController.shortenTranscript)

router.post("/audioup", upload.single('audio'), AudioUPController.saveAudio);
module.exports = router;
    