const router = require("express").Router();
const votesController = require("../controllers/votesControllers.js")


//votes
router.patch("/vote", votesController.vote);//PATCH modifie une partie du modèle PUT modifie tout le modèle et renvoie un nouveau modèle
router.patch("/devote", votesController.devote);


module.exports = router