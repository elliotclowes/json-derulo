const express = require("express");
const UserController = require("../controllers/users");

const router = express.Router();

router.get("/checkEmailToken", UserController.checkEmailToken);
router.get("/username", UserController.getUserByUsername);
router.get("/email", UserController.getUserByEmail);
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/logout", UserController.logout);
router.get("/:id", UserController.getUserById); // move this line to the bottom of all specific routes
router.get("/", UserController.getAllUsers);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

module.exports = router;
