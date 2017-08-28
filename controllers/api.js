let db = require('../models');

module.exports = {
  saveMap: (req, res, next) => {
    db.map.create({
      name: req.body.name,
      public: req.body.public
    }).then((map) => {
      Promise.all([
        map.addMarkers(req.body.markers),
        map.addPaths(req.body.paths)
      ]).then(() => {
        res.status(201).json(map);
      });
    });
  },

  mapList: (req, res, next) => {
    db.map.findAll({
      include: [
        {model: db.marker},
        {model: db.path}
      ]
    }).then((maps) => {
      res.status(200).json(maps);
    });
  },

  mapDetails: (req, res, next) => {
    db.map.findOne({
      where: {id: req.params.id},
      include: [
        {model: db.marker},
        {model: db.path}
      ]
    }).then((map) => {
      if (!map) return res.status(404).send('Not found');
      return res.status(200).json(map);
    });
  },

  mapUpdate: (req, res, next) => {
    db.map.findOne({
      where: {id: req.params.id},
      include: [
        {model: db.marker},
        {model: db.path}
      ]
    }).then((map) => {
      if (!map) return res.status(404).send('Not found');
      map.removeItems().then(() => {
        map.update({
          name: req.body.name,
          public: req.body.public
        }).then(() => {
          Promise.all([
            map.addMarkers(req.body.markers),
            map.addPaths(req.body.paths)
          ]).then(() => {
            return res.status(201).send('Updated');
          });
        });
      });
    });
  },

  mapDelete: (req, res, next) => {
    db.map.destroy({where: {id: req.params.id}})
      .then((removed) => {
        if (removed) return res.sendStatus(200);
        return res.sendStatus(400);
      });
  }
}
