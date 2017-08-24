let LocalStrategy = require('passport-local').Strategy;
let passport = require('passport');
let db = require('../models');
let bcrypt = require('bcrypt');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.user.findById(id).then((user) => {
    if (user) {
      done(null, user.get());
    } else {
      done(user.errors, null);
    }
  });
});

passport.use('login', new LocalStrategy((username, password, done) => {
  db.user.findOne({where: {username: username}})
    .then((user) => {
      if (!user) {
        return done(null, false);
      }

      bcrypt.compare(password, user.password, (err, valid) => {
        if (err) {
          return done(null, false, err);
        }
        if (valid) {
          return done(null, user);
        }
        return done(null, false);
      });
    });
}));

module.exports = passport;
