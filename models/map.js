'use strict';
module.exports = function (sequelize, DataTypes) {
  var Map = sequelize.define('map', {
    name: DataTypes.STRING,
    public: {
      type: DataTypes.BOOLEAN,
      default: true
    },
    creator: DataTypes.INTEGER
  }, {
    freezeTableName: true,
    classMethods: {
      associate: function (models) {
        Map.belongsTo(models.user);
        Map.hasMany(models.marker);
        Map.hasMany(models.path);
      }
    }
  });
  return Map;
};
