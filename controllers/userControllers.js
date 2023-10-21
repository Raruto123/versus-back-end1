const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const maxAge = 3 * 24 * 60 * 60 * 1000;
const nodemailer = require("nodemailer");
const {signUpErrors} = require("../utilities/handleErrors.js");
const {signInErrors} = require("../utilities/handleErrors.js");

//NODEMAILER POUR ENVOYER UN MESSAGE À LA BOITE MAIL DE L'UTILISATEUR

//creer un transporteur SMTP
const transporter = nodemailer.createTransport({
    service : "gmail",
    auth : {
        user : process.env.MY_MAIL,
        pass : process.env.MY_APP_PASSWORD,
    }
});



const personalToken = createToken = (id) => {
    return jwt.sign({id}, process.env.TOKEN_SECRET, {expiresIn : process.env.MaxAge})
};

//inscription
module.exports.signUp = async(req, res) => {
    console.log("Route POST /register reached");
    const {pseudo, email, password} = req.body;

    try{
        //créer un nouvel utilisateur en utilisant les données du req.body
        const newUser = new userModel({pseudo, email, password});
        //créer le token de l'utilisateur
        newUser.token = personalToken(newUser._id);
        console.log(newUser.token);
        //les options du mail à envoyer
        const mailOptions = {
            from : process.env.MY_MAIL,
            to : newUser.email,
            subject : "Validation de votre e-mail",
            text : `Cliquez sur le lien suivant pour valider votre adresse e-mail : http://localhost:3100/api/link/validation/${newUser.token}`
        };
        //envoyer l'e-mail
        transporter.sendMail(mailOptions, (error, info) => {
            console.log("on attend l'email");
            if (error) {
                //il y a erreur dans l'envoi
                console.log("je suis ici :", error);
            }else {
                //l'e-mail est envoyé et l'utilisateur est sauvegardé dans la base de données
                newUser.save();
                console.log("E-mail envoyé :", info.response);
            }
        });
        res.status(200).json({message : "Veuillez check vos mails"});
    }catch(err){
        console.error('Error in signUp route:', err);
        const errors = signUpErrors(err);
        res.status(400).json({errors});
        // Check if the error is a validation error (e.g., duplicate email)
        if (err.name === "ValidationError") {
            res.status(400).json({error : err.message});
        }else{
            // Handle other errors (e.g., database error)
            console.log(err);
            res.status(500).json({error : "Internal Server Error"})
        }
    }
}



// //connexion
module.exports.signIn = async(req, res) => {
    console.log("Route POST /login reached");
    const {email, password} = req.body;

    try{
        const user = await userModel.login(email, password);
        const token = personalToken(user._id);
        res.cookie("jwtoken", token, {httpOnly : true, maxAge : maxAge, sameSite : "none", secure : true});
        res.status(200).json({user : user._id});
    }catch(err){
        console.log("Password entered:", password); // Ajoutez cette ligne pour afficher le mot de passe
        console.error("une erreur est surevenue lors de la connexion", err);
        const errors = signInErrors(err);
        res.status(400).json({errors});
    }
}


//deconnexion
module.exports.logout = async(req, res) => {
    res.cookie("jwtoken", "", {maxAge : 1, httpOnly : true, sameSite : "none", secure : true});
    res.status(400).json({message : "Déconnexion réussie"});
}


//avoir les informations sur l'utilisateur
module.exports.getUser = async(req, res) => {
    console.log(req.params.id);
    try {
        const docs = await userModel.findById(req.params.id);
        res.status(200).send({docs});
        console.log(res.data);
    } catch (error) {
        console.log("ID Inconnu :", error);
    }
}

//avoir les informations de tous les utilisateurs
module.exports.getAllUsers = async(req, res) => {
    try {
        const users3 = await userModel.find().select("-password");
        res.status(200).json({users3});
    } catch (error) {
        res.status(400).json(error);
    }
}