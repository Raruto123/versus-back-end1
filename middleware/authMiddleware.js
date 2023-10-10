const userModel = require("../models/userModel.js");
const jwt = require("jsonwebtoken");

// Check le token de l'utilisateur à n'importe quel endroit de l'application
module.exports.checkUser = (req, res, next) => {
    const token = req.cookies.jwtoken;
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async(err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                // res.cookie("jwt", "", {maxAge : 1});
                next();
            }else{
                let user = await userModel.findById(decodedToken.id);
                res.locals.user = user;
                // next();
            }
            next();
        })
    }else{
        res.locals.user = null;
        next();
    }
};

// Pour se connecter automatiquement s'il a déjà été connecté auparavant
module.exports.requireAuth = (req, res, next) => {
    const token = req.cookies.jwtoken;
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, (err, decodedToken) => {
            if (err) {
                console.error(err);
            } else {
                console.log(decodedToken.id);
                next();
            }
        });
    } else {
        console.log("No Token");
    }
};
