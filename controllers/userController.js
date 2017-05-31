const Users = require('../models/userModel');

exports.register = (req, res) => {
  const userData = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };

  Users.create(userData, (err, newUser) => {
    if (err) {
      res.send(err);
    }

    res.send(newUser);
  });
};

exports.login = (req, res) => {
  const sess = req.session;

  function auth(userRes) {
    userRes.comparePassword(req.body.password, (err, isMatch) => {
      if (err) {
        res.send(err);
      } else {
        sess.auth = isMatch;
        sess.username = userRes.username;

        res.redirect('/'); // redirect to homepage
      }
    });
  }

  Users.findOne({ email: req.body.email }, (err, currentUser) => {
    if (err) {
      res.send(err);
    }

    // return an error if the user is not found
    if (currentUser === null) {
      res.send(err);
    } else {
      auth(currentUser);
    }
  });
};
