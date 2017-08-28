'use strict';
module.exports = function (sequelize, DataTypes) {
  var Map = sequelize.define('map', {
    name: DataTypes.STRING,
    public: {
      type: DataTypes.BOOLEAN,
      default: true
    }
  }, {
    freezeTableName: true
  });

  Map.associate = function (models) {
    Map.belongsTo(models.user);
    Map.hasMany(models.marker, {onDelete: 'CASCADE'});
    Map.hasMany(models.path, {onDelete: 'CASCADE'});
  };

  return Map;
};
