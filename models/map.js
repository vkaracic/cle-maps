'use strict';
module.exports = function (sequelize, DataTypes) {
  var Map = sequelize.define('map', {
    location: DataTypes.STRING,
    public: DataTypes.BOOLEAN,
    creator: DataTypes.INTEGER
  }, {
    freezeTableName: true,
    classMethods: {
      associate: function (models) {
        Map.belongsTo(models.user);
      }
    }
  });
  return Map;
};
