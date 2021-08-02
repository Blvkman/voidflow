const express = require("express");
const router = express.Router();
const User = require("../models/user");

//Prendere la lista di utenti
router.get("/", async (req, res) => {
    try {
        const users = User.find();
        res.status(200).json({status:true,usersList:users})
    } catch (err) {
        res.status(500).json({status:false, message:err.message}).send
    }
})

//Prendere un utente per id
router.get("/:id", getUser, (req, res) => {
    res.json(res.user)
})

//Creare un utente
router.post("/", async (req, res) => {
    const user = new User({
        name: req.body.name,
        surname: req.body.surname,
    })
    try {
        const newuser = await user.save();
        res.status(201).json({status:true,newuser})
    } catch (err) {
        res.status(400).json({status:false, message:err.message}).send
    }
})

//Aggiornare un utente
router.patch("/:id", getUser, async (req, res) => {
    if(req.body.name != null){
        res.user.name = req.body.name
    }
    if(req.body.surname != null){
        res.user.surname = req.body.surname
    }

    try {
        const updatedUser = await res.user.save();
        res.json(updatedUser)
    } catch (err) {
        res.status(400).json({status:false, message:err.message}).send
    }
})

//Eliminare un utente
router.delete("/:id", getUser, async (req, res) => {
    try {
        await res.user.remove();
        res.status(200).json({status:true, message:"User deleted successfully"});
    } catch (err) {
        return res.status(500).json({status:false, message:err.message})
    }
})

//Middlewares
async function getUser(req, res, next) {
    let user;
    try{
        user = await User.findById(req.params.id);
        if(user == null){
            return res.status(404).json({status:false, message: "Cannot find user"})
        }
    } catch (err) {
        return res.status(500).json({status:false, message:err.message})
    }

    res.user = user;
    next()
}

module.exports = router