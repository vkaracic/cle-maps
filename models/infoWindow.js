'use strict';

module.exports = function (sequelize, DataTypes) {
  var InfoWindow = sequelize.define('infoWindow', {
    name: DataTypes.STRING,
    content: DataTypes.STRING,
    placeId: DataTypes.STRING,
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT
  }, {
    freezeTableName: true
  });

  InfoWindow.associate = function (models) {
    this.belongsTo(models.map);
  }
  return InfoWindow;
};
