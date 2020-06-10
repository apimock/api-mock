/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mock', {
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
    'category_id': {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false
    },
    'default_expect_id': {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    'name': {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ''
    },
    'url': {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ''
    },
    'method': {
      type: DataTypes.INTEGER(1).UNSIGNED,
      allowNull: true,
      defaultValue: '1'
    },
    'delay': {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true,
      defaultValue: '0'
    },
    'status': {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true,
      defaultValue: '200'
    },
    'headers': {
      type: DataTypes.TEXT,
      allowNull: true
    },
    'query_params': {
      type: DataTypes.TEXT,
      allowNull: true
    },
    'body_params': {
      type: DataTypes.TEXT,
      allowNull: true
    },
    'body_params_type': {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    'body': {
      type: DataTypes.TEXT,
      allowNull: false
    },
    'script': {
      type: DataTypes.TEXT,
      allowNull: true
    },
    'enable_script': {
      type: DataTypes.INTEGER(4),
      allowNull: true,
      defaultValue: '0'
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
