/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('history', {
    'id': {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    'type': {
      type: DataTypes.INTEGER(2).UNSIGNED,
      allowNull: false
    },
    'type_id': {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false
    },
    'uid': {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false
    },
    'title': {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ''
    },
    'content': {
      type: DataTypes.TEXT,
      allowNull: true
    },
    'detail': {
      type: DataTypes.TEXT,
      allowNull: true
    },
    'created_at': {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'history'
  });
};
