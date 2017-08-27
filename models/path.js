'use strict';
module.exports = function (sequelize, DataTypes) {
  var Path = sequelize.define('path', {
    origin: DataTypes.STRING,
    destination: DataTypes.STRING
  }, {
    freezeTableName: true
  });

  Path.associate = function (models) {
    this.belongsTo(models.map);
  }
  return Path;
};
