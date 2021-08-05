const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {validateData, getUserBody, authenticateAccessToken, authenticateRefreshToken, generateRefreshToken} = require("../utils/middlewares");
const redis_client = require("../utils/redis")

//Login
router.post("/login", getUserBody, async (req, res) => {
    try{
        //const value = await res.user.comparePassword(req.body.password);
        //if(value != true && value != false) res.status(500).json({status:false,message:value}).send;
        if(res.user.password != req.body.password) res.sendStatus(403)
        else{
            const accessToken = jwt.sign(
                {sub: res.user._id},
                process.env.ACCESS_TOKEN,
                {expiresIn: process.env.ACCESS_TIME});

            const refreshToken = generateRefreshToken(res.user._id);
                
            res.status(200).json({status:true,token:{accessToken, refreshToken}}).send
        }
        
    } catch(err) {
        res.status(400).json({status:false,message:err.message})
    }
})

//Logout

router.get("/logout", authenticateAccessToken, authenticateRefreshToken, async (req, res) => {
    const id = req.data.sub;
    const token = req.body.refreshToken;

    try{
        //remove token
        await redis_client.del(id.toString());

        //blacklist token
        await redis_client.set('BL_' + id.toString(), token);
        
        return res.json({status: true, message: "Logout done."});
    } catch (err) {
        res.status(400).json({status:false, message:err.message})
    }
})

//new Token
router.post("/token", authenticateRefreshToken, (req, res) => {
    const id = req.data.sub;
    const accessToken = jwt.sign({sub: id}, process.env.ACCESS_TOKEN, { expiresIn: process.env.ACCESS_TIME});
    const refreshToken = generateRefreshToken(id);
    return res.json({status: true, message: "success", data: {accessToken, refreshToken}});
})

//check status
router.get("/check", authenticateAccessToken, (req, res) => {
    res.send({status:true, tokenData:req.data})
})

//Registrazione
router.post("/register", validateData, async (req, res) => {
    const user = new User({
        mail: req.body.mail,
        password: req.body.password,
        name: req.body.name,
        surname: req.body.surname,
        phone: req.body.phone
    })
    try {
        const newuser = await user.save();
        res.status(201).json({status:true,newuser}).send
    } catch (err) {
        res.status(400).json({status:false, message:err.message}).send
    }
})

module.exports = router;