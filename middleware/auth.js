function isLogged(req, res, next) {
  if (req.session.auth || req.path === '/login') {
    return next();
  }
  res.redirect('/login');
}

module.exports = isLogged;
