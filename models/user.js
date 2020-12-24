"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // ! models 인자 = { Location: Location, User: User }
      // define association here
      // ! A.belongsToMany(B, { through: 'C' }); // A BelongsToMany B through the junction table C
      // ! 저희 코드에서 A에는 뭘 적어야 user모델을 가르킬까요?
      models.User.hasMany(models.UserLocation, {
        foreignKey: "userId", // 안적으면 자동 모델명_고유키 이름 자동 설정
        sourceKey: "id",
      });
      // ? 3.여기에 외래 키 설정하나?
    }
  }
  User.init(
    // ? 4. define -> init, 여기서 외래 키 설정일 수도 있지 않을까 싶습니다.
    {
      userId: DataTypes.STRING,
      password: DataTypes.STRING,
      userName: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};

/*
const Movie = sequelize.define('Movie', { name: DataTypes.STRING });  // ! 클래스 이전에 사용했던 방식.레거시 코드
const Actor = sequelize.define('Actor', { name: DataTypes.STRING });
Movie.belongsToMany(Actor, { through: 'ActorMovies' });
Actor.belongsToMany(Movie, { through: 'ActorMovies' });
*/
