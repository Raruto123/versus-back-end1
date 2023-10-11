const mongoose = require("mongoose");
const {isEmail} = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    pseudo : {
        type : String,
        required : true,
        minlength : 3,
        maxLength : 55,
        unique : true,
        sparse : true,
        trim : true
    },
    email :  {
        type : String,
        required : true,
        lowercase : true,
        trim : true,
        validate : [isEmail]
    },
    password :  {
        type : String,
        required : true, 
        max : 1024,
        minlength : 6
    },
    token : {
        type : String
    },
    emailVerified : {
        type : Boolean,
        default : false
    },
    votes : {
        type : [String]
    }
},
{
    timestamps : true
})


//joue la fonction avant d'enregistrer le document dans la databse pour crypter le password
// userSchema.pre("save", async function(next) {
//     try {
//         // Générer un sel pour le hachage
//         const salt = await bcrypt.genSalt();

//         // Hacher le mot de passe avec le sel généré
//         const hashedPassword = await bcrypt.hash(this.password, salt);

//         // Remplacer le mot de passe non haché par le mot de passe haché
//         this.password = hashedPassword;

//         // Continuer avec le processus de sauvegarde
//         next();
//     } catch (error) {
//         next(error); // Passer l'erreur au middleware suivant
//     }
// });
//pour decrypter le mot de passe lorsqu'il se connecte et pour qu'il reconnaisse
// userSchema.statics.login = async function(email, password) {
//     try {
//         // Rechercher l'utilisateur par son adresse e-mail
//         const user = await this.findOne({ email });

//         if (user) {
//             // Afficher le hachage du mot de passe stocké dans la console
//             console.log("Stored password hash:", user.password);

//             // Comparer le mot de passe entré avec le hachage stocké
//             const auth = await bcrypt.compare(password, user.password);

//             if (auth) {
//                 return user; // Le mot de passe est correct, retourner l'utilisateur
//             }

//             throw Error("incorrect password"); // Mot de passe incorrect
//         }

//         throw Error("incorrect email"); // Adresse e-mail incorrecte
//     } catch (error) {
//         throw error; // Passer l'erreur à la gestion des erreurs
//     }
// };

userSchema.statics.login = async function(email, password) {
    try{
        const user = await this.findOne({email});
        console.log("stored password :", user.password);
        if (user.password === password && user.emailVerified === false) {
            throw Error("Vérifie d'abord ton e-mail");
        }
        if (user.password === password && user.emailVerified === true) {
            return user;
        } else if (user.password !== password) {
            throw Error("incorrect password")
        }
    }catch(error){
        throw error;
    }
}




module.exports = mongoose.model("User", userSchema);
