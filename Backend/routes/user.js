const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {getUser, validateData} = require("../utils/middlewares");

//Prendere la lista di utenti
router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({status:true,usersList:users})
    } catch (err) {
        res.status(500).json({status:false, message:err.message}).send
    }
})

//Prendere un utente per mail
router.get("/:mail", getUser, (req, res) => {
    res.json(res.user)
})

//Aggiornare un utente
router.patch("/:mail", getUser, validateData, async (req, res) => {
    try {
        //Da rivedere
        if(req.body.name != null){
            await User.updateOne({mail:req.params.mail}, {$set: {name:req.body.name}});
        }
        if(req.body.surname != null){
            await User.updateOne({mail:req.params.mail}, {$set: {surname:req.body.surname}});
        }
        if(req.body.phone != null){
            await User.updateOne({mail:req.params.mail}, {$set: {phone:req.body.phone}});
        }

        res.status(201).json({status:true, message:"User updated"})
    } catch (err) {
        res.status(400).json({status:false, message:err.message}).send
    }
})

//Eliminare un utente
router.delete("/:mail", getUser, async (req, res) => {
    try {
        await res.user.remove();
        res.status(200).json({status:true, message:"User deleted successfully"});
    } catch (err) {
        return res.status(500).json({status:false, message:err.message})
    }
})



module.exports = router