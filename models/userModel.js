const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;
const SALT_WORK_FACTOR = 10;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// validate username
userSchema.pre('save', true, (next, done) => {
  const self = this;
  mongoose.models.User.findOne({ username: self.username }, (err, user) => {
    if (err) {
      done(err);
    } else if (user) {
      self.invalidate('username', 'username must be unique');
      done(new Error('Username must be unique'));
    } else {
      done();
    }
  });
  next();
});

// validate email
userSchema.pre('save', true, (next, done) => {
  const self = this;
  mongoose.models.User.findOne({ email: self.email }, (err, user) => {
    if (err) {
      done(err);
    } else if (user) {
      self.invalidate('email', 'email must be unique');
      done(new Error('Email must be unique'));
    } else {
      done();
    }
  });
  next();
});

userSchema.pre('save', function (next) {
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) {
    return next();
  }

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) {
      return next(err);
    }

    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, function (e, hash) {
      if (e) {
        return next(e);
      }

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) {
      return cb(err);
    }

    return cb(null, isMatch);
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
