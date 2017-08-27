let db = require('../models');

module.exports = {
  saveMap: (req, res, next) => {
    console.log(req.body);
    db.map.create({
      name: req.body.name,
      public: req.body.public
    }).then((map) => {
      let markers = JSON.parse(req.body.markers);
      let paths = JSON.parse(req.body.paths);
      Promise.all([
        markers.forEach((marker) => {
          db.marker.create({
            name: marker.name,
            lat: marker.lat,
            lng: marker.lng
          }).then((obj) => {
            console.log(obj);
            obj.setMap(map);
          });
        }),
        paths.forEach((path) => {
          db.path.create({
            origin: path.origin,
            destination: path.destination
          }).then((obj) => {
            obj.setMap(map);
          });
        })
      ]).then(() => {
        res.status(201).send('Map created!');
      });
    });
  }
}
