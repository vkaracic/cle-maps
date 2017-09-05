const express = require('express');
const router = express.Router();
const mapsConfig = require('../config');
const controllers = require('../controllers/');
const passport = require('passport');

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Index' });
});

router.get('/creator', function (req, res, next) {
  res.render('creator', { apiKey: mapsConfig.mapsApiKey });
});

router.get('/creator/:id', function (req, res, next) {
  res.render('creator', { mapId: req.params.id, apiKey: mapsConfig.mapsApiKey });
});

router.get('/register', controllers.registerView);
router.post('/register', controllers.registerUser);

router.get('/login', controllers.loginView);
router.post('/login', passport.authenticate('login', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
