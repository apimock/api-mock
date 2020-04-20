/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_project', {
    'id': {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    'uid': {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    'project_id': {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    'created_at': {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'user_project'
  });
};
