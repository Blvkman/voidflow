const User = require("../models/user");
const jwt = require("jsonwebtoken");
const redis_client = require("./redis")

const mailRe = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//const passRe = /^\$2[ayb]\$.{56}$/; // bCrypt hash
const passRe = /^[a-f0-9]{128}$/;
const nameRe = /^(?!-)[a-zA-Z-]*[a-zA-Z]{2,29}$/ //trattini in mezzo al nome, lettere, massimo di 20 caratteri
const phoneRe = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/

//Middlewares
async function getUserParams(req, res, next) {
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

async function verifyPassword(req, res, next) {
    if(req.body.password != undefined){
        if(!passRe.test(String(req.body.password))){
            return res.status(400).json({status:false, message: "Invalid current password"})
        }
    }if(req.body.newPassword != undefined){
        if(!passRe.test(String(req.body.newPassword))){
            return res.status(400).json({status:false, message: "Invalid newPassword password"})
        }
    }if(req.body.passwordVerify != undefined){
        if(!passRe.test(String(req.body.passwordVerify))){
            return res.status(400).json({status:false, message: "Invalid passwordVerify password"})
        }
    }
    next()
}

async function getUserBody(req, res, next) {
    let user;
    try{
        user = await User.find({mail:req.body.mail});
        if(user[0] == null || user [0] == undefined){
            return res.status(404).json({status:false, message: "Cannot find user"})
        }
    } catch (err) {
        return res.status(500).json({status:false, message:err.message})
    }

    res.user = user[0];
    next()
}

async function getUserToken(req, res, next) {
    const id = req.data.sub;
    let user;
    try{
        user = await User.findById(id);
        if(user == null || user == undefined){
            return res.status(404).json({status:false, message: "Cannot find user " + req.data.sub})
        }
    } catch (err) {
        return res.status(500).json({status:false, message:err.message})
    }

    res.user = user;
    next()
}

function authenticateAccessToken(req, res, next) {
    const headerToken = req.headers['authorization'];
    const token = headerToken && headerToken.split(' ')[1];
    if(token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, data) => {
        if (err) {
            return res.status(403).json({status:false,message:err.message});
        }
        req.data = data;
        next()
    })
}


async function authenticateRefreshToken(req, res, next) {
    const token = req.body.refreshToken;
    if(token == null) return res.sendStatus(401);
    else{
        try{
            const data = jwt.verify(token, process.env.REFRESH_TOKEN)
            req.data = data;
    
            redis_client.get(data.sub.toString(), (err, result) => {
                
                if(err) throw err;
                if(result === null) return res.status(403).json({status:false, message:"Token not in store."});
                if(JSON.parse(result).token != token) return res.status(403).json({status:false, message:"Token not same as the one in store."})
                next()
            })
        } catch (err) {
            return res.status(401).json({status:false, message:err.message})
        }
    }
}

function generateRefreshToken(id){
    
    const refreshToken = jwt.sign(
        {sub: id},
        process.env.REFRESH_TOKEN,
        {expiresIn: process.env.REFRESH_TIME});
    
    redis_client.get(id.toString(), (err, result) => {
        if(err) throw err;

        redis_client.set(id.toString(), JSON.stringify({token: refreshToken}));
    })
    return refreshToken;
}

function authenticateResetToken(req, res, next) {
    const resetToken = req.query.resetToken;
    if(resetToken == null) return res.sendStatus(401);

    jwt.verify(resetToken, process.env.RESET_TOKEN, (err, data) => {
        if (err) {
            return res.status(403).json({status:false,message:err.message});
        }
        req.data = data;
        next()
    })
}

function checkVerified(req, res, next) {
    if(res.user.mailToken != "verified"){
        res.status(400).json({status:false, message:"Verify your email first."})
    } else {
        next();
    }
}

module.exports = {
    getUserParams,
    validateData,
    authenticateAccessToken,
    authenticateRefreshToken,
    generateRefreshToken,
    getUserBody,
    getUserToken,
    verifyPassword,
    authenticateResetToken,
    checkVerified
}