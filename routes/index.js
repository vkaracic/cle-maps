const express = require('express');
const router = express.Router();
const controllers = require('../controllers/');
const passport = require('passport');

router.get('/', controllers.index);

router.get('/creator', controllers.creator);

router.get('/creator/:id', controllers.creatorSavedMap);

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
