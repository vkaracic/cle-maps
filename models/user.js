module.exports = function (sequelize, DataTypes) {
  let User = sequelize.define('user', {
    first_name: {
      type: DataTypes.STRING
    },
    last_name: {
      type: DataTypes.STRING
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM,
      allowNull: false,
      default: 'user',
      values: [
        'admin',
        'user'
      ]
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      default: true,
      allowNull: false
    }
  }, {
    freezeTableName: true
  });

  User.associate = function (models) {
    this.hasMany(models.map);
  };

  return User;
}
