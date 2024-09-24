const mongoose = require('mongoose');
const validator = require('validator');
const becrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'You shuold provide your email!'],
    lowercase: true,
    validate: [validator.isEmail, 'invalid email fromat!'],
    unique: true,
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'You shuold write a password!'],
    minLength: 8,
  },
  passwordConfirme: {
    type: String,
    required: [true, 'Please confirme your password'],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'You should confirme your password!',
    },
  },
});

userSchema.pre('save', async function (next) {
  // if the password is not mdifide should not encrypt it
  if (!this.isModified('password')) return next();

  this.password = await becrypt.hash(this.password, 12);
  this.passwordConfirme = undefined;
});

const User = mongoose.model('User', userSchema);

module.exports = User;
