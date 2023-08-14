const express = require("express");
const multer = require('multer');
const AudioController = require("../controllers/audioup");

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post("/save", upload.single('audio'), AudioController.saveAudio);

router.post("/audioup", upload.single('audio'), AudioController.saveAudio);
module.exports = router;
    