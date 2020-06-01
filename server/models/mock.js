/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mock', {
    'id': {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    'uid': {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    'project_id': {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    'category_id': {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'category',
        key: 'id'
      }
    },
    'url': {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ''
    },
    'method': {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: '1'
    },
    'delay': {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: '0'
    },
    'status': {
      type: DataTypes.INTEGER.UNSIGNED,
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
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    'body': {
      type: DataTypes.TEXT,
      allowNull: true
    },
    'script': {
      type: DataTypes.TEXT,
      allowNull: true
    },
    'enable_script': {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
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
