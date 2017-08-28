const express = require('express');
const router = express.Router();
const controllers = require('../controllers/api');

router.get('/maps', controllers.mapList);
router.post('/maps', controllers.saveMap);
router.get('/maps/:id', controllers.mapDetails);
router.put('/maps/:id', controllers.mapUpdate);
router.delete('/maps/:id', controllers.mapDelete);

module.exports = router;
