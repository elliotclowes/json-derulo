const express = require("express");
const UserController = require("../controllers/users");
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: './uploads/' });

router.get("/checkEmailToken", UserController.checkEmailToken);
router.get("/username", UserController.getUserByUsername);
router.get("/email", UserController.getUserByEmail);
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/get/:token", UserController.getUserByToken);
router.get("/logout", UserController.logout);
router.get("/:id", UserController.getUserById);
router.get("/", UserController.getAllUsers);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);
router.post("/upload", upload.single('file'), UserController.fileUpload);

module.exports = router;
