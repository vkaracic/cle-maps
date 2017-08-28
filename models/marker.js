'use strict';
module.exports = function (sequelize, DataTypes) {
  var Marker = sequelize.define('marker', {
    placeId: DataTypes.STRING,
    name: DataTypes.STRING,
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT
  }, {
    freezeTableName: true
  });

  Marker.associate = function (models) {
    this.belongsTo(models.map);
  }
  return Marker;
};
