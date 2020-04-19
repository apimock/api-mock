/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_project', {
    'id': {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    'uid': {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    'project_id': {
      type: DataTypes.INTEGER,
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
