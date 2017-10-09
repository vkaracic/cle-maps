const express = require('express');
const router = express.Router();
const controllers = require('../controllers/');
const passport = require('passport');
const permissions = require('../utils/permissions');

router.get('/', controllers.index);

router.get('/creator', permissions.isAuthenticated, controllers.creator);

router.get('/creator/:id', permissions.isAuthenticated, controllers.creatorSavedMap);

router.get('/register', controllers.registerView);
router.post('/register', controllers.registerUser);

router.get('/public-maps', controllers.publicMaps);
router.get('/map/:id', controllers.mapDetails);

router.get('/my-maps', permissions.isAuthenticated, controllers.myMaps);

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
