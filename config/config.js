const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  development: {
    username: process.env.DATABASE_USERNAME_ENV,
    password: process.env.DATABASE_PASSWORD_ENV,
    database: process.env.DATABASE_NAME_ENV,
    host: process.env.DATABASE_HOST_ENV,
    dialect: "mysql",
    port: process.env.DATABASE_PORT_ENV,
  },
  test: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    dialect: "mysql",
  },
  production: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    dialect: "mysql",
  },
};
