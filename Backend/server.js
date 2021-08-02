require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true , useUnifiedTopology: true})
const db = mongoose.connection;

db.on("error", (err) => console.log(err));
db.once("open", () => console.log("Database connected . . ."));


app.use(express.json());
app.use("/user", userRoutes);

app.get("/", (req, res) => {
    res.status(200).json({"Status":true}).send;
})

app.listen(3000, () => {
    console.log("Server started at 3000 . . .");
})
