const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const {sendMail} = require("../utils/mailer");
const User = require("../models/user");
const redis_client = require("../utils/redis")
const {validateData, getUserBody, authenticateAccessToken, authenticateRefreshToken, generateRefreshToken, getUserToken, verifyPassword, authenticateResetToken, checkVerified} = require("../utils/middlewares");


//Login
router.post("/login", getUserBody, async (req, res) => {
    try{
        if(res.user.mailToken != "verified"){
            res.status(301).json({status:false,message:"Confirm your email before logging in."}).send;
        }
        else{
            const value = await res.user.comparePassword(req.body.password);
            if(value != true && value != false) res.status(500).json({status:false,message:value}).send;
            else if(!value) res.sendStatus(403)
            else{
                const accessToken = jwt.sign(
                    {sub: res.user._id, services: res.user.services},
                    process.env.ACCESS_TOKEN,
                    {expiresIn: process.env.ACCESS_TIME});

                const refreshToken = generateRefreshToken(res.user._id);
                    
                res.status(200).json({status:true,token:{accessToken, refreshToken}}).send
            }
        }
    } catch(err) {
        res.status(400).json({status:false,message:err.message})
    }
})

//Change password
router.post("/newPass", authenticateAccessToken, verifyPassword, getUserToken, async (req, res) => {
    var password;
    try{
        if(req.body.newPassword == req.body.passwordVerify){
            password = req.body.password;
            bcrypt.compare(password, res.user.password, (err, result) => {
                if (err) res.status(500).json({status:false, message:err.message});
                else if (!result) res.status(400).json({status:false, message:"Invalid password"});
                else{
                    res.user.password = req.body.newPassword;
                    await = res.user.save();
                    res.json({status: true, message: "Password change done."});
                }
            })
        }
        else res.status(400).json({status:false, message:"Passwords are not equal."});
    } catch (err) {
        res.status(400).json({status:false, message:err.message})
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

//Verifica email
router.get("/verify-email", async (req, res) => {
    const token = req.query.token;
    const user = await User.findOne({mailToken:token});
    if(user){
        user.mailToken = "verified";
        user.isVerified = true;
        await user.save();
        res.redirect(`${process.env.REDIRECT_SITE_DEV}/signin`);
    }else{
        res.redirect(`${process.env.REDIRECT_SITE_DEV}/register`);
    }
})

//Start Reset password
router.post("/reset", getUserBody, checkVerified, async (req, res) => {

    if(res.user.resetToken != null && res.user.resetToken != ""){
        jwt.verify(res.user.resetToken, process.env.RESET_TOKEN, (err, data) => {
            if (err) {
                if(err.message != 'jwt expired'){
                    return res.status(403).json({status:false,message:err.message});
                }
            } else {
                res.status(403).json({status:false, message: "We have sent you a reset mail yet."})
            }
        })
    } else {
        console.log('Creiamo token')
        const resetToken = jwt.sign(
            {sub: res.user._id},
            process.env.RESET_TOKEN,
            {expiresIn: process.env.RESET_TIME});
        res.user.resetToken = resetToken;
        try{
            const newuser = await res.user.save();
            sendMail(res.user.mail,
                `Voidflow - reset your password`,
                `<h2>${newuser.name}, here's your reset password mail!</h2>
                <h4>To reset your password, please click <a href="${process.env.REDIRECT_DEV}/reset?resetToken=${resetToken}">here</a>.</h4>`
                );
    
            
            res.status(201).json({status:true,message:"Reset mail sent."}).send
        } catch (err) {
            res.status(500).json({status:false,message:err.message})
            
        }
    }
})

//Verify Reset Token
router.post("/verifyResetToken", authenticateResetToken, async (req, res) => {
 
    res.sendStatus(200);
    
})

//End Reset password
router.post("/resetFinal", authenticateResetToken, verifyPassword, async (req, res) => {
 
    try{
        const user = await User.findOne({resetToken:req.query.resetToken});
        if(user){
            user.resetToken = "";
            user.password = req.body.newPassword;
            await user.save();
            res.status(200).json({status:true,message:"Password reset done."})
        }else{
            res.status(400).json({status:false,message:"User not found."})
        }
    } catch (err) {
        res.status(500).json({status:false,message:err.message})
    }
    
})


//Registrazione
router.post("/register", validateData, async (req, res) => {
    const user = new User({
        mail: req.body.mail,
        password: req.body.password,
        name: req.body.name,
        surname: req.body.surname,
        phone: req.body.phone,
        mailToken: crypto.randomBytes(64).toString("hex"),
        resetToken: "",
        isVerified: false
    })
    try {
        const newuser = await user.save();
        sendMail(req.body.mail,
            `Voidflow - verify your email`,
            `<h2>${user.name}, thanks for registering to our site!</h2>
            <h4>To complete your registration, please click <a href="${process.env.REDIRECT_API_DEV}/verify-email?token=${newuser.mailToken}">here</a>.</h4>`
            );
            
        newuser.mailToken = "";
        res.status(200).json({status:true,newuser}).send
    } catch (err) {
        res.status(400).json({status:false, message:err.message}).send
    }
})

module.exports = router;