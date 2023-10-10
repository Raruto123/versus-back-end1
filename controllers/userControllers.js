const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const maxAge = 3 * 24 * 60 * 60 * 1000;
const nodemailer = require("nodemailer");

//NODEMAILER POUR ENVOYER UN MESSAGE À LA BOITE MAIL DE L'UTILISATEUR

//creer un transporteur SMTP
const transporter = nodemailer.createTransport({
    service : "gmail",
    auth : {
        user : process.env.MY_MAIL,
        pass : process.env.MY_APP_PASSWORD,
    }
});

//options de l'e-mail
// const mailOptions = {
//     from : "proplayer54@gmail.com",
//     to : "cetetec159@klanze.com",
//     subject : "Validation de votre e-mail",
//     text : `Cliquez sur le lien suivant pour valider votre adresse e-mail : http://localhost:3100/api/link/validation/${linkToken}`
// };

//envoyer le mail 
// transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//         console.log(error);
//     }else {
//         console.log("E-mail envoyé :", info.response);
//     }
// });


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
            to : "garemo8964@mugadget.com",
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

// module.exports.signUp = async(req, res) => {
//     console.log('Route POST /signup reached');
//     const {pseudo, email, password} = req.body;

//     try{
//         // Créer un nouvel utilisateur en utilisant les données du req.body
//         const newUser = new userModel({pseudo, email, password});
//         newUser.token = personalToken(newUser._id);
//         res.cookie("jwtoken", newUser.token, {httpOnly : true, maxAge : maxAge, sameSite : "none", secure : true});
//         // Sauvegarder le nouvel utilisateur dans la base de données
//         transporter.sendMail(mailOptions, (error, info) => {
//             console.log("on attend l'email")
//             if (error) {
//                 console.log("ici je suis : ", error);
//             }else {
//                 const user = newUser.save()
//                 console.log("E-mail envoyé :", info.response);
//                 res.status(201).json({user : user._id});
//             }
//         });
//         // const user = await userModel.create({pseudo, email, password})
//     }catch(err){
//         console.error('Error in signUp route:', err);
//         // Check if the error is a validation error (e.g., duplicate email)
//         if (err.name === "ValidationError") {
//             res.status(400).json({error : err.message});
//         }else{
//         // Handle other errors (e.g., database error)
//             console.log(err);
//             res.status(500).json({error : "Internal Server Error"})
//         }
//     }
// }

// //connexion
module.exports.signIn = async(req, res) => {
    console.log("Route POST /login reached");
    const {email, password} = req.body;

    try{
        const user = await userModel.login(email, password);
        // const token = createToken(user._id);
        // res.cookie("jwtoken", token, {httpOnly : true, maxAge : maxAge, sameSite : "none", secure : true});
        res.status(200).json({user : user._id});
    }catch(err){
        console.log("Password entered:", password); // Ajoutez cette ligne pour afficher le mot de passe
        console.error("une erreur est surevenue lors de la connexion", err)
        res.status(400).json({error : err.message});
    }
}


//deconnexion
module.exports.logout = async(req, res) => {
    res.cookie("jwtoken", "", {maxAge : 1, httpOnly : true, sameSite : "none", secure : true});
    res.status(400).json({message : "Déconnexion réussie"});
}