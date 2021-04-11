'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User_Location extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User_Location.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id'});
      models.User_Location.belongsTo(models.Location, { foreignKey: 'locationId', targetKey: 'id'});
    }
  };
  User_Location.init({
    userId: DataTypes.NUMBER,
    locationId: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'User_Location',
  });
  return User_Location;
};