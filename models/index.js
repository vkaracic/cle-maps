'use strict';

var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var basename = path.basename(module.filename);
var config = require('../config');
var db = {};

var sequelize = new Sequelize(config.database, config.username, config.password, config);

fs
  .readdirSync(__dirname)
  .filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function (file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function (modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

Object.keys(db).forEach(function (modelName) {
  if (db[modelName].loadScopes) {
    db[modelName].loadScopes(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.map.prototype.removeItems = function () {
  return new Promise((resolve, reject) => {
    this.getMarkers().then((markers) => {
      markers.forEach((marker) => { marker.destroy() });
    });
    this.getPaths().then((paths) => {
      paths.forEach((path) => { path.destroy() });
    });
    resolve(this);
  });
}

db.map.prototype.addMarkers = function (markers) {
  return new Promise((resolve, reject) => {
    if (markers) {
      markers.forEach((marker) => {
        db.marker.create({
          placeId: marker.placeId,
          name: marker.name,
          lat: marker.lat,
          lng: marker.lng
        }).then((obj) => {
          obj.setMap(this);
        });
      });
    }
    resolve(this);
  });
}

db.map.prototype.addPaths = function (paths) {
  return new Promise((resolve, reject) => {
    if (paths) {
      paths.forEach((path) => {
        db.path.create({
          origin: path.origin,
          destination: path.destination
        }).then((obj) => {
          obj.setMap(this);
        });
      });
    }
    resolve(this);
  });
}

module.exports = db;
