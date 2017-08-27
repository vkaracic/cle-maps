const express = require('express');
const router = express.Router();
const controllers = require('../controllers/api');

router.post('/maps', controllers.saveMap);

module.exports = router;
