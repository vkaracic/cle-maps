let db = require('../models');

module.exports = {
  saveMap: (req, res, next) => {
    db.map.create({
      name: req.body.name,
      public: req.body.public,
      userId: req.user.id
    }).then((map) => {
      if (req.body.markers && req.body.paths) {
        let markers = JSON.parse(req.body.markers);
        let paths = JSON.parse(req.body.paths);
        let infoWindows = JSON.parse(req.body.infoWindows);
        Promise.all([
          map.addMarkers(markers),
          map.addPaths(paths),
          map.addInfoWindows(infoWindows)
        ]).then(() => {
          return res.status(201).json(map);
        });
      }
      return res.status(201).json(map);
    });
  },

  mapList: (req, res, next) => {
    let filter = {};
    if (req.query.public === 'true') {
      filter.where = {public: true};
    } else {
      filter.where = {
        $and: {
          userId: req.user.id,
          $or: [
            {public: true},
            {public: false}
          ]
        }
      };
    };
    db.map.scope('complete').findAll(filter).then((maps) => {
      res.status(200).json(maps);
    });
  },

  mapDetails: (req, res, next) => {
    db.map.scope('complete').findOne({
      where: {id: req.params.id}
    }).then((map) => {
      if (!map) return res.status(404).send('Not found');
      if (!map.public) {
        if (!(req.user && map.userId === req.user.id)) {
          return res.status(403).send('Forbidden');
        }
      }
      return res.status(200).json(map);
    });
  },

  mapUpdate: (req, res, next) => {
    db.map.scope('complete').findOne({where: {id: req.params.id}})
      .then((map) => {
        if (!map) return res.status(404).send('Not found');
        map.removeItems().then(() => {
          map.update({
            name: req.body.name,
            public: req.body.public
          }).then(() => {
            if (req.body.markers && req.body.paths) {
              let markers = JSON.parse(req.body.markers);
              let paths = JSON.parse(req.body.paths);
              let infoWindows = JSON.parse(req.body.infoWindows);
              Promise.all([
                map.addMarkers(markers),
                map.addPaths(paths),
                map.addInfoWindows(infoWindows)
              ]).then(() => {
                return res.status(200).send('Updated');
              });
            }
            return res.status(200).send('Updated');
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
