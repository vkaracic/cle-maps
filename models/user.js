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
      allowNull: false
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
    active: {
      type: DataTypes.BOOLEAN,
      default: true,
      allowNull: false
    }
  }, {
    freezeTableName: true
  });

  return User;
}
