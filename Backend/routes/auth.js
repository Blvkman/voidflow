const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
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
                    {sub: res.user._id},
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

//Mailer
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'voidflowit@gmail.com',
        pass: process.env.MAIL_PASS
    }
})

//Verifica email
router.get("/verify-email", async (req, res) => {
    const token = req.query.token;
    const user = await User.findOne({mailToken:token});
    if(user){
        user.mailToken = "verified";
        user.isVerified = true;
        await user.save();
        res.redirect('/login');
    }else{
        res.redirect('/register');
    }
})

//Start Reset password
router.post("/reset", getUserBody, checkVerified, async (req, res) => {
    const resetToken = jwt.sign(
        {sub: res.user._id},
        process.env.RESET_TOKEN,
        {expiresIn: process.env.RESET_TIME});
    res.user.resetToken = resetToken;
    try{
        const newuser = await res.user.save();
        var mailOptions = {
            from: ` "Reset Password" <voidflowit@gmail.com> `,
            to: res.user.mail,
            subject: `Voidflow - reset your password`,
            html: `<h2>${newuser.name}, here's your reset password mail!</h2>
                    <h4>To reset your password, please click <a href="http://${req.headers.host}/reset?resetToken=${resetToken}">here</a>.</h4>`
        }

        transporter.sendMail(mailOptions, (err, info) => {
            if(err) res.status(500).json({message:err})
            else{
                console.log("Log Mail: reset mail sent to " + user.mail)
            }
        })
        res.status(201).json({status:true,message:"Reset mail sent."}).send
    } catch (err) {
        res.status(500).json({status:false,message:err.message})
        
    }
})

//End Reset password
router.post("/resetFinal", authenticateResetToken, verifyPassword, async (req, res) => {

    if(req.body.newPassword != req.body.passwordVerify){
        res.status(400).json({status:false,message:"The paswords are not equal."})
    } else {
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
        var mailOptions = {
            from: ` "Verify your email" <voidflowit@gmail.com> `,
            to: req.body.mail,
            subject: `Voidflow - verify your email`,
            html: `<h2>${user.name}, thanks for registering to our site!</h2>
                    <h4>To complete your registration, please click <a href="http://${req.headers.host}/verify-email?token=${newuser.mailToken}">here</a>.</h4>`
        }

        transporter.sendMail(mailOptions, (err, info) => {
            if(err) console.log(err)
            else{
                console.log("Log Mail: confirmation mail sent to " + user.mail)
            }
        })
        newuser.mailToken = "";
        res.status(201).json({status:true,newuser}).send
    } catch (err) {
        res.status(400).json({status:false, message:err.message}).send
    }
})

module.exports = router;