const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    mail: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    mailToken:{
      type: String,
      required: true
    },
    resetToken:{
      type: String,
      required: false
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        trim: true,
        required: true
    },
    surname: {
        type: String,
        trim: true,
        required: true
    },
    phone: {
        type: String,
        trim: true,
        required: false,
        default: ""
    },
    active_services: {
        type: String,
        required: false
    },
    date: {
      type: Date,
      default: Date.now()
    }
})

userSchema.methods.comparePassword = async function (password) {
    if (!password) throw new Error('No password found');
  
    try {
      const result = await bcrypt.compare(password, this.password);
      return result;
    } catch (error) {
      console.log('Error while comparing password!', error.message);
      return error;
    }
  };


userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(this.password, salt)
      this.password = hashedPassword;
      next()
    }
});


module.exports = mongoose.model("User", userSchema)