const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
    voters:  {
        type : [String],
        required : true
    },
},
{
     timestamps : true
}
)

module.exports = mongoose.model("Vote", voteSchema);