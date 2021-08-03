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
    }
  };

userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
      bcrypt.hash(this.password, 8, (err, hash) => {
        if (err) return next(err);
  
        this.password = hash;
        next();
      });
    }
  });

module.exports = mongoose.model("User", userSchema)