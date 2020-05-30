/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('expect', {
    'id': {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    'uid': {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    'mock_id': {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    'name': {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: ''
    },
    'params': {
      type: DataTypes.TEXT,
      allowNull: true
    },
    'status': {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '200'
    },
    'delay': {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    'body': {
      type: DataTypes.TEXT,
      allowNull: true
    },
    'enable': {
      type: DataTypes.INTEGER,
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
    tableName: 'expect'
  });
};
