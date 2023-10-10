const router = require("express").Router();
const linkController = require("../controllers/linkController.js");



router.get("/validation/:token", linkController.verify)

module.exports = router