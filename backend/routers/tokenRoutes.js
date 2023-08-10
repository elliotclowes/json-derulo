const express = require("express");
const TokenController = require("../controllers/token");
const router = express.Router();

router.get("/", TokenController.getAllToken);
router.get("/:id", TokenController.getTokenById);
router.get("/get/:token", TokenController.getOneByToken);

module.exports = router;
