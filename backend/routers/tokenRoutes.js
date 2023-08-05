const express = require("express");
const TokenController = require("../controllers/token");
const authenticator = require("../middleware/authenticator");
const router = express.Router();

router.post("/", authenticator, TokenController.getOneByToken);

module.exports = router;
