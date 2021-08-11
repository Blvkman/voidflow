const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {validateData, getUserParams, getUserBody, authenticateAccessToken, authenticateRefreshToken, getUserToken} = require("../utils/middlewares");

//Prendere la lista di utenti
router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({status:true,usersList:users})
    } catch (err) {
        res.status(500).json({status:false, message:err.message}).send
    }
})

//Ritorna i dati dell'utente per mail
router.get("/dashboard", authenticateAccessToken, getUserToken, (req, res) => {
    //res.user.resetCode = "";
    res.json(res.user)
})

//Aggiornare un utente
router.patch("/", authenticateAccessToken, getUserToken, validateData, async (req, res) => {
    try {
        var x = 0;
        //Da rivedere
        if(req.body.name != null){
            await User.updateOne({mail:res.user.mail}, {$set: {name:req.body.name}});
            x++;
        }
        if(req.body.surname != null){
            await User.updateOne({mail:res.user.mail}, {$set: {surname:req.body.surname}});
            x++;
        }
        if(req.body.phone != null){
            await User.updateOne({mail:res.user.mail}, {$set: {phone:req.body.phone}});
            x++;
        }
        if(x === 0){
            res.status(400).json({status:true, message:"No given update fields"})
        }else{
            res.status(202).json({status:true, message:"User updated"})
        }
    } catch (err) {
        res.status(400).json({status:false, message:err.message}).send
    }
})

//Eliminare un utente
router.delete("/:mail", authenticateAccessToken, authenticateRefreshToken, getUserParams, async (req, res) => {
    try {
        await res.user.remove();
        res.status(200).json({status:true, message:"User deleted successfully"});
    } catch (err) {
        return res.status(500).json({status:false, message:err.message})
    }
})



module.exports = router