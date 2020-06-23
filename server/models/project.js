/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('project', {
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
    'name': {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ''
    },
    'base_url': {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    'description': {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    'swagger_url': {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    'notify': {
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
    tableName: 'project'
  });
};
