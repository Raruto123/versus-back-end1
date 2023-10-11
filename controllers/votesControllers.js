const voteModel = require("../models/voteModel");
const userModel = require ("../models/userModel.js");



//votes
module.exports.vote = async(req, res) => {
    console.log(req.params.id);
    try {
        //le nombre de votes qui augmente
        const votes = await voteModel.findByIdAndUpdate(
            req.params.id,
            {$addToSet : { voters : req.body.idToVote}},
            {new : true, upsert : true}
        );

        //le nombre de voters qui augmente
        const voters = await userModel.findByIdAndUpdate(
            req.body.idToVote,
            {$addToSet : { votes : req.params.id}},
            {new : true, upsert : true}
        );

        res.status(200).send({votes, voters});
    } catch (error) {
        res.status(500).send({message : error});
    }
}

//devote
module.exports.devote = async(req, res) => {
    console.log(req.params.id);
    try {
        //le nombre de votes qui baissent
        const devotes = await voteModel.findByIdAndUpdate(
            req.params.id,
            {$pull : {voters : req.body.idToDevote}},
            {new : true, upsert : true}
        );

        //le nombre de voters qui baissent
        const devoters = await userModel.findByIdAndUpdate(
            req.body.idToDevote,
            {$pull : {votes : req.params.id}},
            {new : true, upsert : true}
        );

        res.status(200).send({devotes, devoters});
    } catch (error) {
        res.status(500).send({message : error})
    }
}