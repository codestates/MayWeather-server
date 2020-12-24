"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Location extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Location.hasMany(models.UserLocation, {
        // ! Locations 처럼 복수가 아니라 단수로 수정 부탁드립니다.
        foreignKey: "locationId", // belongsTo의 포린키
        sourceKey: "id",
      });
      // 외래 키 설정은 안 한 상태, 안해도 되나?
    }
  }
  Location.init(
    // ? 여기서 외래 키 설정?
    {
      location: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Location",
    }
  );
  return Location;
};
