/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mock', {
    'id': {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    'project_id': {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true
    },
    'uid': {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true,
      unique: true
    },
    'url': {
      type: DataTypes.CHAR(255),
      allowNull: false,
      defaultValue: ''
    },
    'method': {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true,
      defaultValue: '1'
    },
    'delay': {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true,
      defaultValue: '0'
    },
    'rule': {
      type: DataTypes.TEXT,
      allowNull: false
    },
    'description': {
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
    tableName: 'mock'
  });
};
