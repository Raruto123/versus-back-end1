const express = require("express");
require("dotenv").config({path:"./config/.env"})
require("./config/database");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoutes.js");
const votesRoutes = require("./routes/votesRoutes.js");
const linkRoute = require("./routes/linkRoute.js");
const {checkUser} = require("./middleware/authMiddleware.js");
const {requireAuth} = require("./middleware/authMiddleware.js")

const port = process.env.PORT;

//middlewares
app.use(bodyParser.json());//pour lire req.body
app.use(bodyParser.urlencoded({extended : true}));//pour lire req.params
app.use(cookieParser());//pour lire req.cookies

//jwt
app.get("*", checkUser);
app.get("/jwtid", requireAuth, (req, res) => {
    res.status(200).send(res.locals.user._id);
})


//routes
app.use("/api/user", userRoutes);
app.use("/api/votes", votesRoutes);
app.use("/api/link", linkRoute);
app.get("/", (req, res) => {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.send("API is running")
})

// listen
app.listen(port, () => {
    console.log(`le serveur a commencé sur le port ${port}`)
})

