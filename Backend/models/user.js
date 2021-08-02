const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    telephone: {
        type: String,
        required: false
    },
    active_services: {
        type: String,
        required: false
    }
})

module.exports = mongoose.model("User", userSchema)