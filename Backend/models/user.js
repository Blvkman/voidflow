const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    mail: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false,
        default: "xxxxxxxxxx"
    },
    active_services: {
        type: String,
        required: false
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

/*
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(this.password, salt)
      this.password = hashedPassword;
      next()
    }
  });
*/

module.exports = mongoose.model("User", userSchema)