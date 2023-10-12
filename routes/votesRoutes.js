const router = require("express").Router();
const votesController = require("../controllers/votesControllers.js")


//votes
router.patch("/vote/:id", votesController.vote);//PATCH modifie une partie du modèle PUT modifie tout le modèle et renvoie un nouveau modèle là je m'attaque seulement à la propriété "voters" de mon modèle donc pas besoin de PUT
router.patch("/devote/:id", votesController.devote);

//choices informations
router.get("/", votesController.getVoteInformation);


module.exports = router