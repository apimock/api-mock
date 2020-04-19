/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    'id': {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    'username': {
      type: DataTypes.STRING(45),
      allowNull: false,
      defaultValue: '',
      unique: true
    },
    'email': {
      type: DataTypes.CHAR(40),
      allowNull: true
    },
    'password': {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: ''
    },
    'avatar': {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    'role': {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    'status': {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '1'
    },
    'created_at': {
      type: DataTypes.DATE,
      allowNull: true
    },
    'updated_at': {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'user'
  });
};
