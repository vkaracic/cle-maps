const express = require('express');
const router = express.Router();
const mapsConfig = require('../config/private');
const controllers = require('../controllers/');
const passport = require('passport');

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/maps', function (req, res, next) {
  res.render('maps', { apiKey: mapsConfig.mapsApiKey });
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
