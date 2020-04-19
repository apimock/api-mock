/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('project', {
    'id': {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    'uid': {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      unique: true
    },
    'name': {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: ''
    },
    'members': {
      type: DataTypes.STRING(1500),
      allowNull: true
    },
    'base_url': {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    'sign': {
      type: DataTypes.CHAR(32),
      allowNull: false,
      defaultValue: ''
    },
    'description': {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    'swagger_url': {
      type: DataTypes.STRING(255),
      allowNull: true
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
    tableName: 'project'
  });
};