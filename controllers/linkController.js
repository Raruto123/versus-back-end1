const userModel = require("../models/userModel.js");
const jwt = require("jsonwebtoken");

module.exports.verify = async (req, res) => {
    const token = req.params.token;
    console.log(token);
    try {
        //verifiez si le jeton est valide
        jwt.verify(token, process.env.TOKEN_SECRET, async(err, decodedToken) => {
            if (err) {
                //le jeton est invalide
                return res.status(401).json({message : "Lien de validation invalide ou expiré."});
            }else {
                // Le jeton est valide, mettez à jour l'utilisateur dans la base de données
                const user = await userModel.findOne({token : token});
                console.log(user);
                if (!user) {
                    return res.status(404).json({ message: 'Utilisateur non trouvé.' });
                }
                // Mettez à jour le champ "emailVerified" de l'utilisateur
                user.emailVerified = true;
                await user.save();
                return res.status(200).json({ message: 'Adresse e-mail validée avec succès. Veuillez vous connecter maintenant' });
            }
        } )
    } catch (error) {
        console.error('Erreur lors de la validation de l\'adresse e-mail :', error);
        res.status(500).json({ message: 'Une erreur s\'est produite lors de la validation de l\'adresse e-mail.' })
    }
};