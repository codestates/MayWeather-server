"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
console.log("basename", basename); // index.js!!!!!
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    console.log("file>>>>", file);
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    ); // 파일명에 '.' 0번 째가 아니여야하고 && index.js && .js파일 이여야한다
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    console.log("model>>>>>", model);
    console.log("model.name", model.name); // ? 같은 값?
    // 포이치라서 모델 갯수만큼 메서드 실행되어서 두 번 찍히나 봅니다.
    //model>>>>> Location
    //model>>>>> User

    // 10번 줄  const db = {};
    db[model.name] = model; // db[Location.name ==> Location] = Location
  });

console.log("db>>>>>", db);
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db); // 만약에 db가 {user:값, location:값}
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
