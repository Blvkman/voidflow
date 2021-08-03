require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const {validateData} = require("./utils/middlewares");
const userRoutes = require("./routes/user");
const User = require("./models/user");



mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
const db = mongoose.connection;

db.on("error", (err) => console.log(err));
db.once("open", () => console.log("Database connected . . ."));


app.use(express.json());
app.use("/user", userRoutes);

app.get("/", (req, res) => {
    res.status(200).json({"Status":true}).send;
})

//Login
app.post("/login", (req, res) => {
    //Jwt Authentication in work

    const mail = req.body.mail;
    const password = req.body.mail;
    const user = {mail : mail, password: password};
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN, {expiresIn: '15m'});
    res.send({accessToken:accessToken})
})

//Registrazione
app.post("/register", validateData, async (req, res) => {
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

app.listen(3000, () => {
    console.log("Server started at 3000 . . .");
})
