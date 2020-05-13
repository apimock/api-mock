/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('category', {
    'id': {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    'uid': {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false
    },
    'project_id': {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false
    },
    'name': {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ''
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
    tableName: 'category'
  });
};
