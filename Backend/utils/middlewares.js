const User = require("../models/user");
const mailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passRe = /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/; // un carattere piccolo, uno numerico, uno speciale, almeno 8 caratteri
const nameRe = /^(?!-)[a-zA-Z-]*[a-zA-Z]{2,29}$/ //trattini in mezzo al nome, lettere, massimo di 20 caratteri
const phoneRe = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/

//Middlewares
async function getUser(req, res, next) {
    let user;
    try{
        user = await User.find({mail:req.params.mail});
        if(user[0] == null || user [0] == undefined){
            return res.status(404).json({status:false, message: "Cannot find user"})
        }
    } catch (err) {
        return res.status(500).json({status:false, message:err.message})
    }

    res.user = user[0];
    next()
}


// Middleware importante: richiede nome, cognome, mail, password (telefono non obbligatorio)
function validateData(req, res, next) {
    if(req.body.mail != undefined){
        if(!mailRe.test(String(req.body.mail.toLowerCase()))){
            return res.status(400).json({status:false, message: "Invalid Mail"})
        }
    }
    if(req.body.password != undefined){
        if(!passRe.test(String(req.body.password))){
            return res.status(400).json({status:false, message: "Invalid Password"})
        }
    }
    if(req.body.name != undefined && req.body.surname != undefined){
        if(!nameRe.test(String(req.body.name)) && !nameRe.test(String(req.body.surname))){
            return res.status(400).json({status:false, message: "Invalid Name/Surname"})
        }
    }
    if(req.body.phone != undefined){
        if(!phoneRe.test(String(req.body.phone))){
            return res.status(400).json({status:false, message: "Invalid Phone Number"})
        }
    }
    next()
}

function authenticateToken(req, res, next) {
    const headerToken = req.headers['authorization'];
    const token = headerToken && headerToken.split(' ')[1];
    if(token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            console.log(err)
            return res.sendStatus(403);
        }
        req.user = user;
        next()
    })
}

module.exports = {
    getUser,
    validateData,
    authenticateToken
}