"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserLocation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.UserLocation.belongsTo(models.User, {
        foreignKey: "userId",
        targetKey: "id",
      });
      models.UserLocation.belongsTo(models.Location, {
        foreignKey: "locationId",
        targetKey: "id",
      });
    }
  }
  UserLocation.init(
    {
      userId: DataTypes.INTEGER,
      locationId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "UserLocation",
    }
  );
  return UserLocation;
};
