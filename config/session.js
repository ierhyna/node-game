const session = require('cookie-session');

module.exports = () => session({
  secret: 'FS*%@#%eDF-=JL^&s%&*%TOhf*_ILDH*$^&@#$@W',
  cookie: {
    maxAge: 3600000, // 1 hour
    expires: new Date(Date.now() + 3600000)
  }
});
