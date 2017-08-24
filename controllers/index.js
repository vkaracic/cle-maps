const db = require('../models');
const bcrypt = require('bcrypt');

module.exports = {
  registerView: (req, res, next) => {
    if (req.isAuthenticated()) {
      res.redirect('/');
    } else {
      res.render('register');
    }
  },

  registerUser: (req, res, next) => {
    db.user.findOne({where: {username: req.body.username}})
      .then((user) => {
        if (user) {
          res.setStatus(400).send('Username already exists!');
        } else {
          bcrypt.hash(req.body.password, 8, (err, hash) => {
            if (err) {
              res.setStatus(400).send(err);
            } else {
              db.user.create({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                username: req.body.username,
                password: hash,
                role: req.body.role,
                active: true
              }).then((obj) => {
                if (!obj) {
                  res.setStatus(400).send('An error occured while creating user.');
                } else {
                  res.redirect('/login');
                }
              })
            }
          })
        }
      })
  },

  loginView: (req, res, next) => {
    if (req.isAuthenticated()) {
      res.redirect('/');
    } else {
      res.render('login');
    }
  }
}
