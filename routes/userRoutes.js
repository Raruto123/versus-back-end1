const router = require("express").Router();
const authController = require("../controllers/userControllers.js");





//auth
router.post("/register", authController.signUp);
router.post("/login", authController.signIn);
router.get("/logout", authController.logout);

//user information
router.get("/:id", authController.getUser);
router.get("/", authController.getAllUsers);


module.exports = router