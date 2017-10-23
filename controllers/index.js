const db = require('../models');
const bcrypt = require('bcrypt');
const config = require('../config');

module.exports = {
  index: (req, res, next) => {
    res.render('index', { title: 'Index' });
  },
  creator: (req, res, next) => {
    res.render('creator', { apiKey: config.mapsApiKey });
  },
  creatorSavedMap: (req, res, next) => {
    res.render('creator', { mapId: req.params.id, apiKey: config.mapsApiKey });
  },
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
                is_active: true
              }).then((obj) => {
                if (!obj) {
                  res.setStatus(400).send('An error occured while creating user.');
                } else {
                  res.redirect('/login');
                }
              });
            }
          });
        }
      });
  },

  loginView: (req, res, next) => {
    if (req.isAuthenticated()) {
      res.redirect('/');
    } else {
      res.render('login', {title: 'Login'});
    }
  },

  publicMaps: (req, res, next) => {
    res.render('public-maps', {title: 'Public maps'});
  },

  myMaps: (req, res, next) => {
    res.render('my-maps', {title: 'My maps'});
  },

  mapDetails: (req, res, next) => {
    res.render('map-details', {
      title: 'Map details',
      mapId: req.params.id,
      apiKey: config.mapsApiKey
    });
  }
}
