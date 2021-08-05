require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");



mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
const db = mongoose.connection;

db.on("error", (err) => console.log(err));
db.once("open", () => console.log("Database connected . . ."));

app.get("/", (req, res) => {
    res.send("<h1>VoidFlow Api Live<h1>");
})

app.use(express.json());
app.use("/user", userRoutes);
app.use("/", authRoutes);

app.listen(3000, () => {
    console.log("Server started at 3000 . . .");
})
